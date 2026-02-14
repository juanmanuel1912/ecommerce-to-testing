import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, View, UserAccount } from './types';
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
  AlertCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [notification, setNotification] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Load users and session from localStorage on init
  useEffect(() => {
    const savedUsers = localStorage.getItem('sandbox_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Default user for testing
      const defaultUser = { name: 'Admin User', email: 'admin@test.com', username: 'admin', password: 'password123' };
      setUsers([defaultUser]);
      localStorage.setItem('sandbox_users', JSON.stringify([defaultUser]));
    }

    const session = localStorage.getItem('sandbox_session');
    if (session) setCurrentUser(session);

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').split('?')[0] as View;
      const validViews: View[] = ['shop', 'cart', 'checkout', 'login', 'register', 'test-cases', 'success'];
      if (validViews.includes(hash)) {
        setView(hash);
      } else {
        setView('shop');
      }
      setAuthError(null); // Clear errors on navigation
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newView: View) => {
    window.location.hash = `#/${newView}`;
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    const formData = new FormData(e.currentTarget);
    const newUser: UserAccount = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    if (users.find(u => u.username === newUser.username)) {
      setAuthError("Username already exists");
      return;
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('sandbox_users', JSON.stringify(updatedUsers));
    showNotification("Registration successful! You can now login.");
    navigate('login');
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    const formData = new FormData(e.currentTarget);
    const user = formData.get('username') as string;
    const pass = formData.get('password') as string;

    const found = users.find(u => u.username === user && u.password === pass);
    if (found) {
      setCurrentUser(found.username);
      localStorage.setItem('sandbox_session', found.username);
      navigate('shop');
      showNotification(`Welcome back, ${found.name}!`);
    } else {
      setAuthError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sandbox_session');
    showNotification("Logged out successfully");
    navigate('shop');
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

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('shop')} id="nav-logo">
              <ShoppingBag className="text-indigo-600 h-8 w-8" />
              <span className="font-bold text-xl tracking-tight hidden sm:block">TestStore</span>
            </div>

            <nav className="flex items-center space-x-2 sm:space-x-4">
              <button 
                id="nav-test-cases"
                onClick={() => navigate('test-cases')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${view === 'test-cases' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                <ClipboardList className="h-4 w-4" />
                <span className="hidden xs:block">Test Cases</span>
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

              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700 hidden md:block" id="user-greeting">Hi, {currentUser}</span>
                  <button 
                    id="btn-logout"
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    id="nav-login"
                    onClick={() => navigate('login')}
                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition"
                  >
                    Login
                  </button>
                  <button 
                    id="nav-register"
                    onClick={() => navigate('register')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100 flex items-center space-x-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {notification && (
          <div id="toast-notification" className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4">
            {notification}
          </div>
        )}

        {view === 'shop' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h1 className="text-2xl font-extrabold text-gray-900">Featured Products</h1>
              <div className="flex w-full sm:w-auto space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    id="search-input"
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none border-gray-200"
                  />
                </div>
                <select 
                  id="category-filter"
                  className="border rounded-xl px-3 py-2 text-sm outline-none border-gray-200 bg-white"
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
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
                  data-testid={`product-card-${product.id}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition duration-700"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                      <button 
                        id={`btn-add-to-cart-${product.id}`}
                        onClick={() => addToCart(product)}
                        className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition transform active:scale-95"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-black">Your Cart</h1>
            {cart.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white" id="empty-cart-msg">
                <ShoppingCart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 mb-8 text-xl font-medium">Your cart is feeling a bit light.</p>
                <button onClick={() => navigate('shop')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100">Browse Shop</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4" id="cart-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center space-x-4 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                        <p className="text-indigo-600 font-bold">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-indigo-600" id={`btn-qty-minus-${item.id}`}><Minus className="h-4 w-4" /></button>
                        <span className="font-bold min-w-[1.5rem] text-center" id={`qty-value-${item.id}`}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-indigo-600" id={`btn-qty-plus-${item.id}`}><Plus className="h-4 w-4" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors" id={`btn-remove-${item.id}`}><Trash2 className="h-5 w-5" /></button>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-8 border border-gray-100 rounded-3xl h-fit space-y-6 shadow-xl shadow-gray-100/50">
                  <h3 className="font-black text-xl border-b pb-4">Order Summary</h3>
                  <div className="flex justify-between text-2xl font-black text-gray-900 pt-2">
                    <span>Total</span>
                    <span id="summary-total">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button id="btn-checkout" onClick={() => navigate('checkout')} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Checkout Now</button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'checkout' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-black">Checkout</h1>
            <form id="checkout-form" onSubmit={(e) => { e.preventDefault(); setCart([]); navigate('success'); }} className="bg-white p-8 border border-gray-100 rounded-3xl shadow-xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input id="input-name" required type="text" placeholder="John Doe" className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email</label>
                  <input id="input-email" required type="email" placeholder="john@example.com" className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
              <button id="btn-place-order" type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-lg">Confirm Order</button>
            </form>
          </div>
        )}

        {view === 'success' && (
          <div className="max-w-md mx-auto text-center py-20 space-y-6" id="order-success-container">
            <div className="bg-green-100 p-8 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle className="h-14 w-14 text-green-600" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Success!</h1>
            <p className="text-gray-500">Your order has been placed successfully. Automation works!</p>
            <button id="btn-return-home" onClick={() => navigate('shop')} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition">Back to Store</button>
          </div>
        )}

        {view === 'login' && (
          <div className="max-w-md mx-auto pt-12">
            <div className="bg-white p-10 border border-gray-100 rounded-3xl shadow-2xl space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
                <p className="text-gray-400 text-sm">Log in to your sandbox account</p>
              </div>
              
              {authError && (
                <div id="error-message" className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center space-x-2 text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>{authError}</span>
                </div>
              )}

              <form id="login-form" onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Username</label>
                  <input 
                    id="login-username" 
                    name="username" 
                    required 
                    type="text" 
                    placeholder="e.g. admin"
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Password</label>
                  <input 
                    id="login-password" 
                    name="password" 
                    required 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <button id="btn-login-submit" type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Log In</button>
              </form>
              <p className="text-center text-sm text-gray-500">
                New here? <button onClick={() => navigate('register')} className="text-indigo-600 font-bold hover:underline">Create an account</button>
              </p>
            </div>
          </div>
        )}

        {view === 'register' && (
          <div className="max-w-md mx-auto pt-8">
            <div className="bg-white p-10 border border-gray-100 rounded-3xl shadow-2xl space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-black mb-2">Create Account</h1>
                <p className="text-gray-400 text-sm">Join the automation sandbox</p>
              </div>

              {authError && (
                <div id="error-message" className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center space-x-2 text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>{authError}</span>
                </div>
              )}

              <form id="register-form" onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                  <input id="register-name" name="name" required type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                  <input id="register-email" name="email" required type="email" placeholder="john@test.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                  <input id="register-username" name="username" required type="text" placeholder="johndoe123" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                  <input id="register-password" name="password" required type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button id="btn-register-submit" type="submit" className="w-full bg-indigo-600 text-white py-4 mt-4 rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Register</button>
              </form>
              <p className="text-center text-sm text-gray-500">
                Already have an account? <button onClick={() => navigate('login')} className="text-indigo-600 font-bold hover:underline">Log in</button>
              </p>
            </div>
          </div>
        )}

        {view === 'test-cases' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="text-4xl font-black border-b border-gray-100 pb-6 tracking-tight">Test Scenarios</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="test-cases-grid">
              {TEST_CASES.map(tc => (
                <div key={tc.id} className="bg-white border border-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow" id={`test-case-${tc.id}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-indigo-600 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">{tc.id}</span>
                    <h3 className="font-bold text-xl text-gray-900">{tc.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">{tc.description}</p>
                  <div className="bg-indigo-50/50 p-4 rounded-2xl">
                    <div className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-widest">Expected Result</div>
                    <p className="text-xs text-indigo-900 font-bold leading-relaxed">{tc.expectedResult}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm font-medium">Sandbox E-commerce for QA Automation Engineers</p>
        </div>
      </footer>
    </div>
  );
};

export default App;