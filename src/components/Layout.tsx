import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  LayoutDashboard, 
  BookOpen, 
  MailWarning, 
  ShieldCheck, 
  LogOut, 
  User as UserIcon,
  Shield,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/", roles: ["ADMIN", "ANALYST", "EMPLOYEE", "AUDITOR"] },
    { name: "Training", icon: BookOpen, path: "/courses", roles: ["ADMIN", "ANALYST", "EMPLOYEE"] },
    { name: "Simulations", icon: MailWarning, path: "/phishing", roles: ["ADMIN", "ANALYST"] },
    { name: "Audits", icon: ShieldCheck, path: "/audits", roles: ["ADMIN", "ANALYST", "AUDITOR"] },
  ];

  const filteredItems = menuItems.filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#141414] bg-[#E4E3E0] sticky top-0 h-screen">
        <div className="p-6 border-bottom border-[#141414] flex items-center gap-2">
          <Shield className="w-8 h-8 text-[#141414]" />
          <span className="font-bold text-xl tracking-tighter uppercase">CyberGuard</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 transition-all duration-200 ${
                location.pathname === item.path 
                  ? "bg-[#141414] text-[#E4E3E0]" 
                  : "hover:bg-[#141414] hover:text-[#E4E3E0]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-mono text-sm uppercase tracking-wider">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#141414]">
          <div className="flex items-center gap-3 p-3 mb-4">
            <UserIcon className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase truncate">{user?.name}</span>
              <span className="text-[10px] opacity-60 uppercase font-mono">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all duration-200 text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-mono text-sm uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#E4E3E0] border-b border-[#141414] z-50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6" />
          <span className="font-bold tracking-tighter uppercase">CyberGuard</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-[#E4E3E0] z-40 md:hidden pt-20"
          >
            <nav className="p-6 space-y-4">
              {filteredItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 border border-[#141414] font-mono uppercase tracking-widest"
                >
                  <item.icon className="w-6 h-6" />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 border border-[#141414] font-mono uppercase tracking-widest bg-[#141414] text-[#E4E3E0]"
              >
                <LogOut className="w-6 h-6" />
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
