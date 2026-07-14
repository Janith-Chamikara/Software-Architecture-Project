import React from 'react';
import { LayoutDashboard, MapPinned, Tags, ShieldCheck, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'District Analytics', icon: MapPinned, active: false },
  { label: 'Category Analytics', icon: Tags, active: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-gray-900 text-gray-100 flex flex-col transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold tracking-tight">Admin Portal</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-gray-800 text-xs text-gray-500">
          Traffic Fine Management System
        </div>
      </aside>
    </>
  );
};
