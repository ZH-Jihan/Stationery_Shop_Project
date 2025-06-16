import { Types } from 'mongoose';
import { Cart } from '../cart/cart.model';
import { Order } from '../order/order.model';
import { ProductModel } from '../product/product.model';
import { User } from '../user/user.model';

const calculatePercentageChange = (
  current: number,
  previous: number,
): string => {
  if (previous === 0) return '+100%';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
};

const getLastMonthData = async (model: any, match: any = {}) => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return model.aggregate([
    { $match: { ...match, createdAt: { $gte: lastMonth } } },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
};

const getAdminDashboardStats = async () => {
  // Get data for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Get current month's data
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  // Get last month's data
  const lastMonth = new Date(currentMonth);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // Get total counts
  const [totalOrders, totalProducts, totalUsers] = await Promise.all([
    Order.countDocuments(),
    ProductModel.countDocuments(),
    User.countDocuments(),
  ]);

  // Get last month's counts
  const [lastMonthOrders, lastMonthProducts, lastMonthUsers] =
    await Promise.all([
      getLastMonthData(Order),
      getLastMonthData(ProductModel),
      getLastMonthData(User),
    ]);

  // Calculate revenue
  const revenueResult = await Order.aggregate([
    { $match: { 'payment.status': 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  const lastMonthRevenueResult = await Order.aggregate([
    {
      $match: {
        'payment.status': 'paid',
        createdAt: { $gte: lastMonth, $lt: currentMonth },
      },
    },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

  // Get order status counts
  const orderStatusCounts = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get payment status counts
  const paymentStatusCounts = await Order.aggregate([
    {
      $group: {
        _id: '$payment.status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get payment method counts
  const paymentMethodCounts = await Order.aggregate([
    {
      $group: {
        _id: '$payment.method',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Get user activity for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const [userActivity, newUsers] = await Promise.all([
    User.aggregate([
      {
        $match: {
          lastActive: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$lastActive' },
            month: { $month: '$lastActive' },
            day: { $dayOfMonth: '$lastActive' },
          },
          activeUsers: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]),
    User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]),
  ]);

  // Get top products with revenue
  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSales: { $sum: '$items.quantity' },
        totalRevenue: {
          $sum: { $multiply: ['$items.price', '$items.quantity'] },
        },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
  ]);

  // Get sales data with average order value
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        'payment.status': 'paid',
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
        avgOrderValue: { $avg: '$totalPrice' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    revenueChange: calculatePercentageChange(totalRevenue, lastMonthRevenue),
    ordersChange: calculatePercentageChange(
      totalOrders,
      lastMonthOrders[0]?.count || 0,
    ),
    productsChange: calculatePercentageChange(
      totalProducts,
      lastMonthProducts[0]?.count || 0,
    ),
    usersChange: calculatePercentageChange(
      totalUsers,
      lastMonthUsers[0]?.count || 0,
    ),
    orderStatusCounts: orderStatusCounts.reduce(
      (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
      {},
    ),
    paymentStatusCounts: paymentStatusCounts.reduce(
      (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
      {},
    ),
    paymentMethodCounts: paymentMethodCounts.reduce(
      (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
      {},
    ),
    recentOrders: recentOrders.map((order) => ({
      id: order._id.toString(),
      user: (order.user as any)?.name || 'Unknown User',
      total: order.totalPrice,
      status: order.status,
      date: order.createdAt?.toISOString() || '',
      paymentStatus: order.payment.status,
      paymentMethod: order.payment.method,
    })),
    topProducts: topProducts.map((product) => {
      const details = Array.isArray(product.productDetails)
        ? product.productDetails[0]
        : product.productDetails;
      const isNotObjectId =
        details &&
        typeof details === 'object' &&
        details !== null &&
        !(details instanceof Types.ObjectId) &&
        !('toHexString' in details);
      return {
        id: product._id.toString(),
        name: isNotObjectId ? details.name : undefined,
        price: isNotObjectId ? details.price : undefined,
        stock: isNotObjectId ? details.quantity : undefined,
        category: isNotObjectId ? details.category : undefined,
        sales: product.totalSales,
        revenue: product.totalRevenue,
      };
    }),
    salesData: salesData.map((data) => ({
      month: `${data._id.year}-${data._id.month}`,
      revenue: data.revenue,
      orders: data.orders,
      avgOrderValue: data.avgOrderValue,
    })),
    userActivity: userActivity.map((data) => {
      const newUsersForDay = newUsers.find(
        (n) =>
          n._id.year === data._id.year &&
          n._id.month === data._id.month &&
          n._id.day === data._id.day,
      );
      return {
        date: `${data._id.year}-${data._id.month}-${data._id.day}`,
        activeUsers: data.activeUsers,
        newUsers: newUsersForDay?.count || 0,
      };
    }),
  };
};

const getUserDashboardStats = async (userId: Types.ObjectId) => {
  // Get data for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Get current month's data
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  // Get last month's data
  const lastMonth = new Date(currentMonth);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // Get user's orders
  const [totalOrders, lastMonthOrders] = await Promise.all([
    Order.countDocuments({ user: userId }),
    Order.countDocuments({
      user: userId,
      createdAt: { $gte: lastMonth, $lt: currentMonth },
    }),
  ]);

  // Calculate total spent
  const totalSpentResult = await Order.aggregate([
    { $match: { user: userId, 'payment.status': 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalSpent = totalSpentResult[0]?.total || 0;

  const lastMonthSpentResult = await Order.aggregate([
    {
      $match: {
        user: userId,
        'payment.status': 'paid',
        createdAt: { $gte: lastMonth, $lt: currentMonth },
      },
    },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const lastMonthSpent = lastMonthSpentResult[0]?.total || 0;

  // Get order status counts
  const orderStatusCounts = await Order.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get recent orders
  const recentOrders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Get wishlist items
  const wishlistItems = await User.findById(userId)
    .select('wishlist')
    .populate('wishlist')
    .lean();

  // Get cart items
  const cartItems = await Cart.findOne({ user: userId })
    .select('items')
    .populate('items.product')
    .lean();

  // Get wishlist change
  const lastMonthWishlist = await User.findById(userId)
    .select('wishlist')
    .lean();
  const wishlistChange = calculatePercentageChange(
    wishlistItems?.wishlist?.length || 0,
    lastMonthWishlist?.wishlist?.length || 0,
  );

  // Get cart change
  const lastMonthCart = await Cart.findOne({ user: userId })
    .select('items')
    .lean();
  const cartChange = calculatePercentageChange(
    cartItems?.items?.length || 0,
    lastMonthCart?.items?.length || 0,
  );

  // Get recommended products with more sophisticated algorithm
  const userCategories = await Order.aggregate([
    { $match: { user: userId } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $group: {
        _id: '$productDetails.category',
        count: { $sum: 1 },
        totalSpent: {
          $sum: { $multiply: ['$items.price', '$items.quantity'] },
        },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 3 },
  ]);

  const recommendedProducts = await ProductModel.find({
    category: { $in: userCategories.map((c) => c._id) },
    _id: { $nin: wishlistItems?.wishlist?.map((w: any) => w._id) || [] },
  })
    .sort({ rating: -1, price: 1 })
    .limit(3)
    .lean();

  return {
    totalSpent,
    totalOrders,
    wishlistCount: wishlistItems?.wishlist?.length || 0,
    cartItems: cartItems?.items?.length || 0,
    spentChange: calculatePercentageChange(totalSpent, lastMonthSpent),
    ordersChange: calculatePercentageChange(totalOrders, lastMonthOrders),
    wishlistChange,
    cartChange,
    orderStatusCounts: orderStatusCounts.reduce(
      (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
      {},
    ),
    recentOrders: recentOrders.map((order) => ({
      id: order._id.toString(),
      date: order.createdAt?.toISOString() || '',
      total: order.totalPrice,
      status: order.status,
      items: order.items.length,
    })),
    wishlistItems:
      wishlistItems?.wishlist?.map((item: any) => ({
        id: item._id.toString(),
        name: item.name,
        price: item.price,
        image: item.images[0],
      })) || [],
    recommendedProducts: recommendedProducts.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      image: product.image[0],
      rating: product.rating || 0,
      category: product.category,
      stock: product.quantity,
    })),
  };
};

export const DashboardServices = {
  getAdminDashboardStats,
  getUserDashboardStats,
};
