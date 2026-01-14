import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Chrome, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = username.trim() === 'username' && password === 'password';
    if (isValid) {
      setError('');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try username / password.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020202]">
      {/* Background Animated Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
          {/* Inner Highlight Glimmer */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block p-3 bg-orange-600/10 rounded-2xl mb-4"
            >
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-bold text-black text-xl">
                R
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back</h1>
            <p className="text-gray-400 text-sm">Log in to your RIVE account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Username
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 group">
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0c0c0c] px-2 text-gray-500 tracking-tighter">Or continue with</span>
            </div>
          </div>

          <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3">
            <Chrome className="w-5 h-5" />
            Google
          </button>

          <p className="text-center text-gray-500 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/" className="text-orange-500 hover:underline font-medium">
              Get started
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;


