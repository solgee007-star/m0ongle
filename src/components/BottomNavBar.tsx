/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TabType } from '../types.ts';
import { Calendar, PenLine, HeartHandshake, Home, MoreHorizontal } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'today' as TabType, label: '오늘', icon: Calendar },
    { id: 'mind' as TabType, label: '마음기록', icon: PenLine },
    { id: 'calm' as TabType, label: '응급상자', icon: HeartHandshake },
    { id: 'room' as TabType, label: '구름방', icon: Home },
    { id: 'more' as TabType, label: '더보기', icon: MoreHorizontal },
  ];

  return (
    <nav
      aria-label="주 메뉴"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100/80 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-all duration-200 select-none ${
                isActive
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-600 font-normal'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-100/70 scale-105' : 'bg-transparent'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={isActive ? 'text-emerald-700' : 'text-slate-400'}
                />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
