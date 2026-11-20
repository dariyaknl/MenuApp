import React from 'react';
import { Calendar, Heart, Home, ReceiptText, User } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeOrdersCount: number;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  activeOrdersCount,
}) => {
  const items: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: Calendar },
    { id: 'orders', label: 'Orders', icon: ReceiptText },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#ECEAF6] px-2 py-1.5"
    >
      <div className="grid grid-cols-5 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className="flex flex-col items-center justify-center py-1 min-h-[48px] transition active:scale-95 relative"
            >
              <div
                className={`relative w-10 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#EEECFD] text-[#3F32E5]' : 'text-[#6C6A82]'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.id === 'orders' && activeOrdersCount > 0 ? (
                  <span
                    aria-label={`${activeOrdersCount} active orders`}
                    className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-[#F55A31] ring-2 ring-white"
                  />
                ) : null}
              </div>
              <span
                className={`text-[10.5px] mt-0.5 leading-none ${
                  isActive
                    ? 'font-bold text-[#3F32E5]'
                    : 'font-medium text-[#6C6A82]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
