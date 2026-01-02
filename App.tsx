
import React, { useState } from 'react';
import Layout from './components/Layout';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import { AppMode } from './types';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.CHAT);
  const [chatKey, setChatKey] = useState(0); // Used to force re-render/clear chat

  const handleNewChat = () => {
    setChatKey(prev => prev + 1);
    setActiveMode(AppMode.CHAT);
  };

  return (
    <Layout activeMode={activeMode} onModeChange={setActiveMode} onNewChat={handleNewChat}>
      <div className="h-full w-full flex flex-col overflow-hidden" key={chatKey}>
        {activeMode === AppMode.CHAT && <ChatView mode={AppMode.CHAT} />}
        {activeMode === AppMode.GROUNDING && <ChatView mode={AppMode.GROUNDING} />}
        {activeMode === AppMode.IMAGES && <ImageView />}
      </div>
    </Layout>
  );
};

export default App;
