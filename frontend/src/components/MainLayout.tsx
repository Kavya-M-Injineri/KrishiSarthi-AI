import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Scan, Droplet, CloudRain, PawPrint, TrendingUp, Lightbulb, User, Leaf, Sprout } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/scan', label: 'Scan', icon: Scan },
  { path: '/soil', label: 'Soil', icon: Sprout },
  { path: '/water', label: 'Water', icon: Droplet },
  { path: '/weather', label: 'Weather', icon: CloudRain },
  { path: '/wildlife', label: 'Wildlife', icon: PawPrint },
  { path: '/market', label: 'Market', icon: TrendingUp },
  { path: '/advisory', label: 'Advisory', icon: Lightbulb },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Top Navigation with Vine Underlines */}
      <nav className="bg-white/80 backdrop-blur-md border-b-2 border-green-200 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-800">KrishiSarthi AI</span>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative group px-4 py-2 rounded-lg transition-all hover:bg-green-50"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-green-700'} group-hover:text-green-600 transition-colors`} />
                      <span className={`${isActive ? 'text-green-700' : 'text-green-600'} group-hover:text-green-700 transition-colors`}>
                        {item.label}
                      </span>
                    </div>
                    
                    {/* Vine Underline Effect */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 transform origin-center transition-all duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}>
                      <div className="absolute -top-1 left-1/4 w-1 h-1 bg-green-500 rounded-full" />
                      <div className="absolute -top-1 right-1/4 w-1 h-1 bg-green-500 rounded-full" />
                    </div>
                    
                    {/* Leaf Hover Animation */}
                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300">
                      <Leaf className="w-3 h-3 text-green-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer with Soil Texture */}
      <footer className="relative mt-16 h-32 bg-gradient-to-t from-amber-900 via-amber-800 to-transparent opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM3ODM1MGYiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSIxLjUiIGZpbGw9IiM3ODM1MGYiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-40" />
        <div className="absolute bottom-4 left-1/4 animate-pulse">
          <Sprout className="w-8 h-8 text-green-600" />
        </div>
        <div className="absolute bottom-6 left-1/2 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Sprout className="w-6 h-6 text-green-500" />
        </div>
        <div className="absolute bottom-4 right-1/3 animate-pulse" style={{ animationDelay: '1s' }}>
          <Sprout className="w-7 h-7 text-emerald-600" />
        </div>
      </footer>
    </div>
  );
}
