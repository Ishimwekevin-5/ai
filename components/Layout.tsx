
import React, { useState } from 'react';
import { AppMode } from '../types';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Globe, 
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Settings,
  MoreHorizontal,
  SquarePen
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onNewChat: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeMode, onModeChange, onNewChat }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: AppMode.CHAT, icon: MessageSquare, label: 'Chat', desc: 'Standard AI Assistant' },
    { id: AppMode.GROUNDING, icon: Globe, label: 'Search', desc: 'Live Web Grounding' },
    { id: AppMode.IMAGES, icon: ImageIcon, label: 'Generate', desc: 'Visual Creation' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#212121] text-[#ececec] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-[260px]' : 'w-0'
        } transition-all duration-300 ease-in-out bg-[#171717] flex flex-col border-r border-white/5 overflow-hidden z-30`}
      >
        <div className="min-w-[260px] p-3 flex flex-col h-full">
          {/* Header Actions in Sidebar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-[#2f2f2f] rounded-lg transition-colors group relative"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-5 h-5 text-zinc-400 group-hover:text-white" />
            </button>
            <button 
              onClick={onNewChat}
              className="p-2 hover:bg-[#2f2f2f] rounded-lg transition-colors group"
              title="New chat"
            >
              <SquarePen className="w-5 h-5 text-zinc-400 group-hover:text-white" />
            </button>
          </div>

          {/* New Chat Primary Button */}
          <button 
            onClick={onNewChat}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#2f2f2f] transition-colors mb-6 group border border-white/5"
          >
            <div className="bg-white/10 p-1 rounded-full group-hover:bg-white/20">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">New Chat</span>
          </button>

          {/* Nav Sections */}
          <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar">
            <div>
              <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Capabilities</p>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onModeChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 ${
                    activeMode === item.id 
                      ? 'bg-[#2f2f2f] text-white shadow-sm' 
                      : 'text-zinc-400 hover:bg-[#2f2f2f] hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeMode === item.id ? 'text-blue-400' : ''}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Today</p>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm text-zinc-400 hover:bg-[#2f2f2f] hover:text-white rounded-lg truncate transition-colors">
                  Improving UI Architecture
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-zinc-400 hover:bg-[#2f2f2f] hover:text-white rounded-lg truncate transition-colors">
                  Gemini API Implementation
                </button>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#2f2f2f] transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                JD
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Developer Mode</p>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden bg-[#212121]">
        {/* Top Header */}
        <header className="h-14 flex items-center justify-between px-4 sticky top-0 z-20 bg-[#212121]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 hover:bg-[#2f2f2f] rounded-lg transition-colors group"
                  title="Open sidebar"
                >
                  <PanelLeftOpen className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                </button>
                <button 
                  onClick={onNewChat}
                  className="p-2 hover:bg-[#2f2f2f] rounded-lg transition-colors group"
                  title="New chat"
                >
                  <SquarePen className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#2f2f2f] transition-colors cursor-pointer group ml-1">
              <span className="font-semibold text-lg">Gemini 3</span>
              <span className="text-zinc-500 text-lg group-hover:text-zinc-300">▼</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="p-2 hover:bg-[#2f2f2f] rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-zinc-400" />
             </button>
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                <User className="w-5 h-5 text-white" />
             </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
