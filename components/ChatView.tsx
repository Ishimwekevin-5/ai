
import React, { useState, useRef, useEffect } from 'react';
import { Message, GroundingSource, AppMode } from '../types';
import { generateChatResponse, generateWithGrounding } from '../services/gemini';
import { Send, Sparkles, ExternalLink, Bot, User, Loader2 } from 'lucide-react';

interface ChatViewProps {
  mode: AppMode;
}

const ChatView: React.FC<ChatViewProps> = ({ mode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      if (mode === AppMode.GROUNDING) {
        response = await generateWithGrounding(input);
      } else {
        response = await generateChatResponse(input);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        groundingSources: (response as any).sources,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Handle error UI if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="bg-blue-600/20 p-4 rounded-full mb-4">
              <Sparkles className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {mode === AppMode.GROUNDING ? 'Search the Real World' : 'Intelligent Assistant'}
            </h2>
            <p className="text-gray-400 max-w-md">
              {mode === AppMode.GROUNDING 
                ? 'Ask about current events, news, or technical documentation. I will cite my sources.' 
                : 'Experience the power of Gemini 3 Pro for coding, reasoning, and creative writing.'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-gray-700' : 'bg-blue-600'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="space-y-2">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/5 border border-white/10 text-gray-200'
                }`}>
                  {msg.content}
                </div>
                
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sources Found</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.groundingSources.map((source, i) => (
                        <a
                          key={i}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs text-blue-400 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="max-w-[150px] truncate">{source.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-sm text-gray-400">Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 glass">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === AppMode.GROUNDING ? "What's the latest in AI research?" : "Message Gemini..."}
            className="w-full bg-white/5 border border-white/10 text-white pl-4 pr-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-500 mt-3 font-medium">
          Powered by Gemini 3 Flash & Google Search Grounding. AI may generate inaccurate info.
        </p>
      </div>
    </div>
  );
};

export default ChatView;
