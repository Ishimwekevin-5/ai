
import React, { useState } from 'react';
import Layout from './components/Layout';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import { AppMode } from './types';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.CHAT);

  return (
    <Layout activeMode={activeMode} onModeChange={setActiveMode}>
      <div className="h-full w-full flex flex-col">
        {activeMode === AppMode.CHAT && <ChatView mode={AppMode.CHAT} />}
        {activeMode === AppMode.GROUNDING && <ChatView mode={AppMode.GROUNDING} />}
        {activeMode === AppMode.IMAGES && <ImageView />}
      </div>
    </Layout>
  );
};

export default App;
