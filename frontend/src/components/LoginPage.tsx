import { useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.authenticated) {
      localStorage.setItem("farmer_id", data.farmer_id);
      onLogin();
    } else {
      alert("Invalid email or password");
    }
  } catch (err) {
    console.error(err);
    alert("Server error. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-8 overflow-hidden relative">
      {/* Light Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Floating Saplings Animation - Lighter Colors */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`
          }}
        >
          <Sprout className="text-green-300 w-8 h-8" />
        </motion.div>
      ))}

      <div className="w-full max-w-6xl flex items-center gap-12 relative z-10">
        {/* Left Side - Bright Farm Image */}
        <motion.div 
          className="hidden lg:flex flex-1 justify-center items-center relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            {/* Light Border Frame */}
            <div className="absolute -inset-2 bg-gradient-to-br from-green-200 via-emerald-200 to-blue-200 rounded-3xl opacity-60" />
            
            <div className="relative bg-white p-2 rounded-3xl shadow-xl">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1618420876506-a803e106a94c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBncmVlbiUyMGZhcm0lMjBmaWVsZHxlbnwxfHx8fDE3NjM2NTkxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Bright Farm Field"
                className="w-[500px] h-[600px] object-cover rounded-2xl"
                style={{ 
                  filter: 'brightness(1.1) saturate(1.1)',
                }}
              />
              
              {/* Light Overlay Gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-100/10 via-transparent to-blue-100/10" />
            </div>

            {/* Light Glowing Effects */}
            <motion.div
              className="absolute -top-4 -right-4 w-20 h-20 bg-green-300 rounded-full opacity-40 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-300 rounded-full opacity-40 blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Animated Saplings - Light Colors */}
            <motion.div
              className="absolute -bottom-4 left-8"
              animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sprout className="text-green-500 w-12 h-12 drop-shadow-md" />
            </motion.div>
            <motion.div
              className="absolute -bottom-2 right-12"
              animate={{ scale: [1, 1.15, 1], rotate: [5, -5, 5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Sprout className="text-emerald-400 w-10 h-10 drop-shadow-md" />
            </motion.div>
            <motion.div
              className="absolute -top-4 left-16"
              animate={{ scale: [1, 1.2, 1], rotate: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sprout className="text-lime-400 w-8 h-8 drop-shadow-md" />
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Card with Light Theme */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="border-2 border-green-200 bg-white/80 backdrop-blur-sm p-12 shadow-xl relative overflow-hidden">
            {/* Decorative Leaves */}
            <div className="absolute top-4 right-4 opacity-20">
              <Leaf className="text-green-600 w-24 h-24" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <Leaf className="text-emerald-600 w-20 h-20 rotate-45" />
            </div>

            <div className="relative z-10">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sprout className="text-green-600 w-10 h-10" />
                  <h1 className="text-green-800">KrishiSarthi AI</h1>
                </div>
                <p className="text-green-700">Your Smart Farming Companion</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-green-800 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="farmer@krishisarthi.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-green-800 mb-2">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Sprout className="w-5 h-5 mr-2" />
                  Sign In to Dashboard
                </Button>
                <a href="/register">Create account</a>

                <div className="text-center mt-4">
                <a href="/register" className="text-green-700 hover:underline">
                 New farmer? Create account
                </a>
                </div>

              </form>

              {/* Animated Saplings near card */}
              <div className="mt-8 flex justify-center gap-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  >
                    <Sprout className="text-green-500 w-6 h-6" />
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Soil-textured Footer with Seedlings */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-900/40 to-transparent"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1724434675268-12d925ffc366?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwdGV4dHVyZSUyMGVhcnRoJTIwZ3JvdW5kfGVufDF8fHx8MTc2MzY1NzcyMnww&ixlib=rb-4.1.0&q=80&w=1080)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      >
        <div className="flex justify-around items-end h-full px-8 pb-4">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 40 + i * 3, opacity: 0.6 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            >
              <Sprout className="text-green-600" style={{ width: 16 + i * 2, height: 16 + i * 2 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}