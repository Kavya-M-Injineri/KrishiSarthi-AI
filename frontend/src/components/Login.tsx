import { useState } from 'react';
import { Leaf, Sprout } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Saplings */}
      <div className="absolute bottom-10 left-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
        <Sprout className="w-8 h-8 text-green-600 opacity-60" />
      </div>
      <div className="absolute bottom-20 left-32 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>
        <Sprout className="w-6 h-6 text-green-500 opacity-50" />
      </div>
      <div className="absolute top-20 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
        <Sprout className="w-7 h-7 text-emerald-600 opacity-60" />
      </div>

      <div className="w-full max-w-6xl flex items-center gap-12">
        {/* Left Side - Watercolor Tree Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="relative">
            <svg width="400" height="500" viewBox="0 0 400 500" className="opacity-80">
              {/* Tree trunk */}
              <path
                d="M180 500 Q180 350, 200 200 L200 500 Z"
                fill="url(#trunkGradient)"
                className="drop-shadow-lg"
              />
              {/* Main foliage - watercolor effect */}
              <ellipse cx="200" cy="200" rx="120" ry="150" fill="url(#foliageGradient1)" opacity="0.7" />
              <ellipse cx="160" cy="180" rx="100" ry="120" fill="url(#foliageGradient2)" opacity="0.6" />
              <ellipse cx="240" cy="190" rx="90" ry="110" fill="url(#foliageGradient3)" opacity="0.65" />
              <ellipse cx="200" cy="150" rx="80" ry="100" fill="url(#foliageGradient4)" opacity="0.7" />
              
              {/* Gradients */}
              <defs>
                <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#654321" stopOpacity="0.9" />
                </linearGradient>
                <radialGradient id="foliageGradient1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </radialGradient>
                <radialGradient id="foliageGradient2">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </radialGradient>
                <radialGradient id="foliageGradient3">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#15803d" />
                </radialGradient>
                <radialGradient id="foliageGradient4">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="100%" stopColor="#22c55e" />
                </radialGradient>
              </defs>
              
              {/* Leaves details */}
              <circle cx="150" cy="160" r="15" fill="#10b981" opacity="0.6" />
              <circle cx="250" cy="170" r="18" fill="#059669" opacity="0.5" />
              <circle cx="200" cy="130" r="12" fill="#34d399" opacity="0.7" />
            </svg>
            
            {/* Small saplings around tree */}
            <div className="absolute -bottom-8 left-10">
              <Sprout className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -bottom-4 right-16">
              <Sprout className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-green-200">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-green-800 mb-2">KrishiSarthi AI</h1>
              <p className="text-green-600">Your Smart Farming Companion</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@krishisarthi.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
              >
                <Sprout className="w-4 h-4 mr-2" />
                Login to Dashboard
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <a href="#" className="text-green-600 hover:text-green-700 block">
                Forgot Password?
              </a>
              <p className="text-green-600">
                New farmer? <a href="#" className="text-green-700 hover:underline">Create Account</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Soil-textured Footer with Seedlings */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-900 via-amber-800 to-transparent opacity-30">
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-amber-950 opacity-40" />
      </div>
      <div className="absolute bottom-2 left-1/4">
        <Sprout className="w-6 h-6 text-green-400" />
      </div>
      <div className="absolute bottom-4 left-1/3">
        <Sprout className="w-5 h-5 text-green-500" />
      </div>
      <div className="absolute bottom-3 right-1/3">
        <Sprout className="w-6 h-6 text-emerald-400" />
      </div>
      <div className="absolute bottom-2 right-1/4">
        <Sprout className="w-5 h-5 text-green-500" />
      </div>
    </div>
  );
}