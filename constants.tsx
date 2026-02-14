
import { Product, TestCase } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Quantum Speaker",
    price: 199.99,
    description: "Experience sound like never before with high-fidelity audio.",
    category: "Electronics",
    image: "https://picsum.photos/seed/speaker/400/400",
    rating: 4.5
  },
  {
    id: 2,
    name: "Nebula Smartwatch",
    price: 249.50,
    description: "Track your fitness and stay connected with this sleek smartwatch.",
    category: "Wearables",
    image: "https://picsum.photos/seed/watch/400/400",
    rating: 4.8
  },
  {
    id: 3,
    name: "Titanium Laptop",
    price: 1299.99,
    description: "The ultimate power machine for creators and professionals.",
    category: "Electronics",
    image: "https://picsum.photos/seed/laptop/400/400",
    rating: 4.9
  },
  {
    id: 4,
    name: "Aurora Headphones",
    price: 150.00,
    description: "Active noise cancelling with 40 hours of battery life.",
    category: "Electronics",
    image: "https://picsum.photos/seed/headphone/400/400",
    rating: 4.2
  },
  {
    id: 5,
    name: "Zenith Coffee Maker",
    price: 89.95,
    description: "Brew the perfect cup of coffee every single morning.",
    category: "Home",
    image: "https://picsum.photos/seed/coffee/400/400",
    rating: 4.0
  },
  {
    id: 6,
    name: "Glacier Flask",
    price: 34.99,
    description: "Keeps drinks cold for 24 hours or hot for 12 hours.",
    category: "Lifestyle",
    image: "https://picsum.photos/seed/flask/400/400",
    rating: 4.7
  }
];

export const TEST_CASES: TestCase[] = [
  {
    id: "TC-001",
    title: "User Login - Successful",
    description: "Verify that a user can log in with valid credentials.",
    steps: [
      "Navigate to the login page (#/login)",
      "Enter 'admin' in the username field",
      "Enter 'password123' in the password field",
      "Click the Login button"
    ],
    expectedResult: "User is redirected to the home page and sees 'Welcome, admin'."
  },
  {
    id: "TC-002",
    title: "Add Product to Cart",
    description: "Verify that clicking 'Add to Cart' updates the cart count.",
    steps: [
      "Navigate to the shop page",
      "Find the product 'Quantum Speaker'",
      "Click 'Add to Cart'",
      "Check the header cart icon badge"
    ],
    expectedResult: "Cart badge displays '1' and product is visible in the cart view."
  },
  {
    id: "TC-003",
    title: "Remove from Cart",
    description: "Verify that products can be removed from the shopping cart.",
    steps: [
      "Add a product to the cart",
      "Navigate to the cart page (#/cart)",
      "Click the 'Remove' button next to the product"
    ],
    expectedResult: "The product is removed from the cart and the total is updated to $0."
  },
  {
    id: "TC-004",
    title: "Checkout Form Validation",
    description: "Verify that empty fields trigger validation errors in checkout.",
    steps: [
      "Add a product to cart and go to checkout (#/checkout)",
      "Leave the 'Full Name' field empty",
      "Click 'Place Order'"
    ],
    expectedResult: "An error message 'Full Name is required' is displayed."
  },
  {
    id: "TC-005",
    title: "Filter by Category",
    description: "Verify that category filtering displays only relevant products.",
    steps: [
      "Navigate to the shop page",
      "Select 'Electronics' from the category dropdown"
    ],
    expectedResult: "Only products with category 'Electronics' are visible in the grid."
  },
  {
    id: "TC-006",
    title: "User Registration - Valid Data",
    description: "Verify that a new user can register successfully.",
    steps: [
      "Navigate to the register page (#/register)",
      "Fill in all fields with valid data",
      "Ensure passwords match",
      "Click 'Create Account'"
    ],
    expectedResult: "A success notification appears and the user is redirected to the login page."
  }
];
