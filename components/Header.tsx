
import React from 'react';
import { CameraIcon, ChatBubbleIcon } from './icons';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary ${
        isActive
          ? 'bg-brand-primary text-white'
          : 'text-text-secondary hover:bg-base-200 hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10 border-b border-base-300">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold text-xl tracking-wider">
              Storyboard <span className="text-brand-primary">AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NavButton
              isActive={activeTab === Tab.GENERATOR}
              onClick={() => setActiveTab(Tab.GENERATOR)}
            >
              <CameraIcon className="w-5 h-5" />
              Generator
            </NavButton>
            <NavButton
              isActive={activeTab === Tab.CHATBOT}
              onClick={() => setActiveTab(Tab.CHATBOT)}
            >
              <ChatBubbleIcon className="w-5 h-5" />
              Chatbot
            </NavButton>
          </div>
        </div>
      </nav>
    </header>
  );
};
