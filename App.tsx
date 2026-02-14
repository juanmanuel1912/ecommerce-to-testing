import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, View } from './types';
import { MOCK_PRODUCTS, TEST_CASES } from './constants';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  Trash2, 
  Plus, 
  Minus, 
  Search, 
  CheckCircle,
  ClipboardList,
  LogOut,
  ChevronRight,
  UserPlus,
  Globe,
  Github,
  Zap,
  ExternalLink,
  Info,
  RefreshCw
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').split('?')[0] as View;
      const validViews: View[] = ['shop', 'cart', 'checkout', 'login', 'register', 'test-cases', 'success', 'deploy'];
      if (validViews.includes(hash)) {
        setView(hash);
      } else if (window.location.hash === '' || window.location.hash === '#/') {
        setView('shop');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newView: View) => {
    window.location.hash = `#/${newView}`;
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification(`Added ${product.name} to cart`);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('shop')} id="nav-logo">
              <ShoppingBag className="text-indigo-600 h-8 w-8" />
              <span className="font-bold text-xl tracking-tight hidden sm:block">TestStore</span>
            </div>

            <nav className="flex items-center space-x-4">
              <button 
                id="nav-test-cases"
                onClick={() => navigate('test-cases')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${view === 'test-cases' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                <ClipboardList className="h-4 w-4" />
                <span>Test Cases</span>
              </button>
              
              <div className="relative">
                <button 
                  id="nav-cart"
                  onClick={() => navigate('cart')}
                  className="p-2 text-gray-400 hover:text-indigo-600 relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cart.length > 0 && (
                    <span id="cart-badge" className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>

              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700" id="user-greeting">Welcome, {user}</span>
                  <button 
                    id="btn-logout"
                    onClick={() => setUser(null)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button 
                  id="nav-login"
                  onClick={() => navigate('login')}
                  className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {notification && (
          <div id="toast-notification" className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-bounce">
            {notification}
          </div>
        )}

        {view === 'shop' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Discover Products</h1>
              <div className="flex w-full sm:w-auto space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    id="search-input"
                    type="text" 
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
                <select 
                  id="category-filter"
                  className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Home">Home</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="product-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition group flex flex-col"
                  data-testid={`product-card-${product.id}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{product.category}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-medium text-gray-600">{product.rating}</span>
                        <div className="text-yellow-400">★</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-gray-900" data-testid="product-price">${product.price.toFixed(2)}</span>
                      <button 
                        id={`btn-add-to-cart-${product.id}`}
                        onClick={() => addToCart(product)}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center" id="no-results">
                  <p className="text-gray-500 text-lg">No products found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            {cart.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-white" id="empty-cart-msg">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-6 text-lg">Your cart is currently empty.</p>
                <button 
                  onClick={() => navigate('shop')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                  <span>Start Shopping</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4" id="cart-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white p-4 border rounded-xl flex items-center space-x-4" data-testid={`cart-item-${item.id}`}>
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg border">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-indigo-600 transition"
                          id={`btn-qty-minus-${item.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium min-w-[1.5rem] text-center" id={`qty-value-${item.id}`}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-indigo-600 transition"
                          id={`btn-qty-plus-${item.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 p-2"
                        id={`btn-remove-${item.id}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 border rounded-xl h-fit space-y-6">
                  <h3 className="font-bold text-lg border-b pb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span id="summary-subtotal">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
                      <span>Total</span>
                      <span id="summary-total">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    id="btn-checkout"
                    onClick={() => navigate('checkout')}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'checkout' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <form 
              id="checkout-form"
              onSubmit={(e) => {
                e.preventDefault();
                setCart([]);
                navigate('success');
              }}
              className="bg-white p-8 border rounded-2xl shadow-sm space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input 
                    id="input-name"
                    required 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input 
                    id="input-email"
                    required 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Shipping Address</label>
                  <input 
                    id="input-address"
                    required 
                    type="text" 
                    placeholder="123 Automation St, Dev City"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Card Number</label>
                  <input 
                    id="input-card"
                    required 
                    type="text" 
                    placeholder="**** **** **** 4242"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Expiry</label>
                    <input 
                      id="input-expiry"
                      required 
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">CVC</label>
                    <input 
                      id="input-cvc"
                      required 
                      type="text" 
                      placeholder="123"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t flex items-center justify-between">
                <div className="text-gray-600">
                  Order Total: <span className="text-xl font-bold text-gray-900 ml-2">${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  id="btn-place-order"
                  type="submit"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  Place Order Now
                </button>
              </div>
            </form>
          </div>
        )}

        {view === 'success' && (
          <div className="max-w-md mx-auto text-center py-20 space-y-6" id="order-success-container">
            <div className="bg-green-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 animate-pulse">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">Order Successful!</h1>
            <p className="text-gray-500 text-lg">Thank you for your purchase. Your order #77412 is being processed.</p>
            <button 
              id="btn-return-home"
              onClick={() => navigate('shop')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Back to Shop
            </button>
          </div>
        )}

        {view === 'login' && (
          <div className="max-w-md mx-auto pt-12">
            <div className="bg-white p-8 border rounded-2xl shadow-xl space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-500">Sign in to your test account</p>
              </div>
              <form 
                id="login-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  setUser(formData.get('username') as string);
                  navigate('shop');
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Username</label>
                  <input 
                    id="login-username"
                    name="username"
                    required 
                    defaultValue="admin"
                    type="text" 
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <input 
                    id="login-password"
                    name="password"
                    required 
                    defaultValue="password123"
                    type="password" 
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <button 
                  id="btn-login-submit"
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                  Log In
                </button>
              </form>
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <button 
                    id="link-to-register"
                    onClick={() => navigate('register')}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {view === 'register' && (
          <div className="max-w-md mx-auto pt-12">
            <div className="bg-white p-8 border rounded-2xl shadow-xl space-y-8">
              <div className="text-center">
                <div className="bg-indigo-100 p-3 rounded-full w-fit mx-auto mb-4 text-indigo-600">
                  <UserPlus className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                <p className="text-gray-500">Join the automation sandbox</p>
              </div>
              <form 
                id="register-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  showNotification("Registration successful! Please login.");
                  navigate('login');
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input 
                    id="register-name"
                    required 
                    type="text" 
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <input 
                    id="register-email"
                    required 
                    type="email" 
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Username</label>
                  <input 
                    id="register-username"
                    required 
                    type="text" 
                    placeholder="janedoe"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <input 
                      id="register-password"
                      required 
                      type="password" 
                      placeholder="********"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Confirm</label>
                    <input 
                      id="register-confirm-password"
                      required 
                      type="password" 
                      placeholder="********"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                </div>
                <button 
                  id="btn-register-submit"
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'test-cases' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center space-x-3 border-b pb-4">
              <ClipboardList className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Automation Test Cases</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="test-cases-grid">
              {TEST_CASES.map(tc => (
                <div key={tc.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:border-indigo-200 transition" id={`test-case-${tc.id}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md">{tc.id}</span>
                    <h3 className="font-bold text-gray-900 flex-grow ml-3">{tc.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{tc.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Steps</h4>
                      <ul className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                        {tc.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Expected Result</h4>
                      <p className="text-xs text-indigo-600 font-medium italic">{tc.expectedResult}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 border-t py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 Automation Sandbox. Perfect for Selenium/Cypress testing.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;