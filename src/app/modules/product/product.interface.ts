export type Product = {
  name: string;
  brand: string;
  image: string;
  price: number;
  category:
    | 'Writing'
    | 'Office Supplies'
    | 'Art Supplies'
    | 'Educational'
    | 'Technology';
  description: string;
  quantity: number;
  inStock: boolean;
  isDeleted: boolean;
};
