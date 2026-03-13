import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">FormForge</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              New Form
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
