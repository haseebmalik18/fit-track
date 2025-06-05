// Sidebar.tsx - Navigation sidebar
import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  Target,
  Utensils,
  Dumbbell,
  TrendingUp,
  Settings,
  User,
  LogOut,
  Apple,
  Activity,
  Calendar,
  Award,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", icon: Home, href: "/dashboard", current: true },
    { name: "Nutrition", icon: Utensils, href: "/nutrition", current: false },
    { name: "Workouts", icon: Dumbbell, href: "/workouts", current: false },
    { name: "Progress", icon: TrendingUp, href: "/progress", current: false },
    { name: "Goals", icon: Target, href: "/goals", current: false },
    { name: "Calendar", icon: Calendar, href: "/calendar", current: false },
    {
      name: "Achievements",
      icon: Award,
      href: "/achievements",
      current: false,
    },
  ];

  const bottomNavigation = [
    { name: "Profile", icon: User, href: "/profile" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div
      className={`
      w-64 bg-white shadow-xl flex flex-col h-full
      ${isOpen ? "fixed inset-y-0 left-0 z-50 lg:relative" : "hidden lg:flex"}
      lg:translate-x-0 transition-transform duration-300 ease-in-out
    `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FitTrack</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  item.current
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <item.icon
                className={`
                mr-3 h-5 w-5 flex-shrink-0
                ${
                  item.current
                    ? "text-blue-500"
                    : "text-gray-400 group-hover:text-gray-500"
                }
              `}
              />
              {item.name}
            </a>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-1 flex-shrink-0">
          {bottomNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              {item.name}
            </a>
          ))}

          <button
            onClick={logout}
            className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
