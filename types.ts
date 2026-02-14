export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserAccount {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: string[];
  expectedResult: string;
}

export type View = 'shop' | 'cart' | 'checkout' | 'login' | 'register' | 'test-cases' | 'success' | 'deploy';