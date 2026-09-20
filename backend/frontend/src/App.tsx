import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Nearby from './pages/Nearby';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductSearch from './pages/ProductSearch';
import ProductDetails from './pages/ProductDetails';
import ShoppingList from './pages/ShoppingList';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { token, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="p-4 border-b bg-white/50 dark:bg-slate-800/50 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">SmartBuy AI</h1>
          <nav>
            <Link to="/" className="mr-4">Home</Link>
            <Link to="/nearby" className="mr-4">Nearby</Link>
            {token ? (
                <button onClick={handleSignOut} className="rounded px-3 py-1 bg-slate-900 text-white">Sign out</button>
            ) : (
              <>
                <Link to="/login" className="mr-4">Login</Link>
                <Link to="/register" className="rounded px-3 py-1 bg-blue-600 text-white">Register</Link>
              </>
            )}
            <Link to="/search" className="ml-4">Search</Link>
            <Link to="/shopping-list" className="ml-4">Shopping List</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<ProductSearch />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
        </Routes>
      </main>
    </div>
  );
}
