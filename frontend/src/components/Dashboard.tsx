import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Scan, 
  Sprout, 
  Droplets, 
  Cloud, 
  PawPrint, 
  TrendingUp, 
  BookOpen,
  Leaf
} from 'lucide-react';
import { Card } from './ui/card';

const features = [
  {
    title: 'Crop Disease Scanner',
    description: 'AI-powered plant disease detection and treatment recommendations',
    icon: Scan,
    path: '/scan',
    gradient: 'from-green-400 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1665503906483-80b4d4a1d149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHNhcGxpbmclMjBzZWVkbGluZ3xlbnwxfHx8fDE3NjM2NTc3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Soil & Fertility Analysis',
    description: 'Comprehensive soil health check and nutrient recommendations',
    icon: Sprout,
    path: '/soil',
    gradient: 'from-amber-600 to-orange-600',
    image: 'https://images.unsplash.com/photo-1724434675268-12d925ffc366?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwdGV4dHVyZSUyMGVhcnRoJTIwZ3JvdW5kfGVufDF8fHx8MTc2MzY1NzcyMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Water & Irrigation Advisor',
    description: 'Smart water management and irrigation scheduling',
    icon: Droplets,
    path: '/water',
    gradient: 'from-blue-400 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1733054434298-d1ad105d5c5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm1sYW5kJTIwZmllbGRzJTIwY3JvcHN8ZW58MXx8fHwxNzYzNjU3NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Weather & Climate Alerts',
    description: '7-day forecasts and extreme weather notifications',
    icon: Cloud,
    path: '/weather',
    gradient: 'from-sky-400 to-blue-500',
    image: 'https://images.unsplash.com/photo-1733054434298-d1ad105d5c5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm1sYW5kJTIwZmllbGRzJTIwY3JvcHN8ZW58MXx8fHwxNzYzNjU3NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Wildlife Detection & Prevention',
    description: 'AI wildlife monitoring and forest department alerts',
    icon: PawPrint,
    path: '/wildlife',
    gradient: 'from-green-600 to-emerald-700',
    image: 'https://images.unsplash.com/photo-1677915762983-c64fc9152c45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB3aWxkbGlmZSUyMG5hdHVyZXxlbnwxfHx8fDE3NjM2NDkwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Market Price Prediction',
    description: 'Real-time mandi prices and best selling predictions',
    icon: TrendingUp,
    path: '/market',
    gradient: 'from-purple-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1733054434298-d1ad105d5c5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm1sYW5kJTIwZmllbGRzJTIwY3JvcHN8ZW58MXx8fHwxNzYzNjU3NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    title: 'Daily Smart Advisory',
    description: 'Personalized farming insights and AI recommendations',
    icon: BookOpen,
    path: '/advisory',
    gradient: 'from-emerald-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1665503906483-80b4d4a1d149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHNhcGxpbmclMjBzZWVkbGluZ3xlbnwxfHx8fDE3NjM2NTc3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-12">
      {/* Header with Sapling Decoration */}
      <motion.div 
        className="text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sprout className="text-green-600 w-12 h-12" />
          </motion.div>
          <h1 className="text-green-800">Welcome to KrishiSarthi AI</h1>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sprout className="text-emerald-600 w-12 h-12" />
          </motion.div>
        </div>
        <p className="text-green-700 mb-6">Your comprehensive farming companion powered by AI</p>
      </motion.div>

      {/* Seasonal Crop Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-green-800 mb-6 text-center">Seasonal Crop Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rabi Season - Light Blue Theme */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 opacity-10">
              <Sprout className="text-blue-400 w-32 h-32" />
            </div>
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg">
                  <Sprout className="text-white w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-blue-900">Rabi Season Crops</h3>
                  <p className="text-blue-600">October - March (Winter Season)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/70 rounded-lg p-4 border border-blue-200 shadow-sm">
                  <p className="text-blue-800 mb-2">Recommended Crops:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Wheat', 'Barley', 'Gram', 'Peas', 'Mustard', 'Lentil'].map((crop, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm shadow-sm">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-100/70 rounded-lg p-4 border border-blue-200 shadow-sm">
                  <p className="text-blue-900">Best for cooler temperatures • Requires less water</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Kharif Season - Light Green Theme */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 opacity-10">
              <Sprout className="text-green-400 w-32 h-32" />
            </div>
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 shadow-lg">
                  <Sprout className="text-white w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-green-900">Kharif Season Crops</h3>
                  <p className="text-green-600">June - October (Monsoon Season)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/70 rounded-lg p-4 border border-green-200 shadow-sm">
                  <p className="text-green-800 mb-2">Recommended Crops:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Rice', 'Maize', 'Cotton', 'Soybean', 'Bajra', 'Jowar'].map((crop, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm shadow-sm">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-green-100/70 rounded-lg p-4 border border-green-200 shadow-sm">
                  <p className="text-green-900">Thrives in warm & humid conditions • Monsoon dependent</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Feature Cards Grid */}
      <div>
        <h2 className="text-green-800 mb-6 text-center">Smart Farming Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link to={feature.path}>
                  <Card className="group relative overflow-hidden border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-2xl cursor-pointer h-full">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${feature.image})` }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50`} />
                    </div>

                    {/* Sapling Accents */}
                    <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity">
                      <Sprout className="text-green-600 w-8 h-8" />
                    </div>
                    <div className="absolute bottom-3 left-3 opacity-20">
                      <Leaf className="text-green-500 w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="relative p-8 space-y-4">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                        <Icon className="text-white w-8 h-8" />
                      </div>
                      
                      <div>
                        <h3 className="text-green-900 mb-3">{feature.title}</h3>
                        <p className="text-green-700">{feature.description}</p>
                      </div>

                      {/* Hover Effect - Growing Sapling */}
                      <motion.div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sprout className="text-green-500 w-6 h-6" />
                      </motion.div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Decorative Saplings */}
      <div className="flex justify-center gap-8 pt-12">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: i * 0.3
            }}
          >
            <Sprout className="text-green-500 w-8 h-8 opacity-40" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}