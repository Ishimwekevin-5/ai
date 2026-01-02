
import React from 'react';
import { AppMode } from '../types';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Globe, 
  Github,
  Layout as LayoutIcon,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeMode, onModeChange }) => {
  const menuItems = [
    { id: AppMode.CHAT, icon: MessageSquare, label: 'Intelligent Chat', desc: 'Powered by Gemini 3 Flash' },
    { id: AppMode.GROUNDING, icon: Globe, label: 'Web Search', desc: 'Real-time Search Grounding' },
    { id: AppMode.IMAGES, icon: ImageIcon, label: 'Image Forge', desc: 'Gemini 2.5 Visuals' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#030712]">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 border-r border-white/10 glass hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl">
              <LayoutIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">Gemini Studio</h1>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Enterprise Starter</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onModeChange(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${
                  activeMode === item.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/30' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeMode === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} />
                <div className="text-left flex-1">
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-[10px] opacity-60 font-medium">{item.desc}</div>
                </div>
                {activeMode === item.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <a 
            href="#" 
            className="flex items-center gap-3 p-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
            Deploy to Vercel
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#030712]">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 border-b border-white/10 glass flex items-center justify-between">
          <h1 className="font-bold text-lg">Gemini Studio</h1>
          <div className="flex gap-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => onModeChange(item.id)}
                className={`p-2 rounded-lg ${activeMode === item.id ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400'}`}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
