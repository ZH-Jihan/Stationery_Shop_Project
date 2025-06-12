"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const order_routes_1 = require("../modules/order/order.routes");
const product_routes_1 = require("../modules/product/product.routes");
const user_routes_1 = require("../modules/user/user.routes");
const router = (0, express_1.Router)();
const allRoutersModel = [
    {
        path: '/products',
        route: product_routes_1.ProductRouters,
    },
    {
        path: '/orders',
        route: order_routes_1.OrderRoutes,
    },
    {
        path: '/user',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes,
    },
];
allRoutersModel.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
