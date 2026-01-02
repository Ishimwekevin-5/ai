
import React, { useState, useRef, useEffect } from 'react';
import { Message, GroundingSource, AppMode } from '../types';
import { generateChatResponse, generateWithGrounding } from '../services/gemini';
import { Send, Sparkles, ExternalLink, Bot, User, Loader2, ArrowUp } from 'lucide-react';

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Scrollable Message Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          {messages.length === 0 && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full mb-6">
                <Bot className="w-7 h-7 text-black" />
              </div>
              <h1 className="text-3xl font-semibold mb-8 tracking-tight">How can I help you today?</h1>
              <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  { icon: "💡", text: "Explain quantum physics", sub: "to a five year old" },
                  { icon: "✍️", text: "Write a short story", sub: "about a lost robot" },
                  { icon: "💻", text: "Fix this React bug", sub: "debugging help" },
                  { icon: "🌍", text: "Travel plan for Tokyo", sub: "3-day itinerary" },
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(item.text)}
                    className="p-4 bg-transparent border border-white/10 rounded-2xl text-left hover:bg-white/5 transition-colors group"
                  >
                    <span className="block text-sm font-medium mb-1">{item.icon} {item.text}</span>
                    <span className="text-xs text-zinc-500">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-4 group">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10 overflow-hidden">
                {msg.role === 'user' ? (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">U</div>
                ) : (
                  <div className="w-full h-full bg-[#19c37d] flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
                )}
              </div>
              <div className="flex-1 space-y-2 min-w-0">
                <p className="font-bold text-xs uppercase tracking-wider text-zinc-500">
                  {msg.role === 'user' ? 'You' : 'Gemini'}
                </p>
                <div className="text-[15px] leading-relaxed text-zinc-200 prose prose-invert max-w-none">
                  {msg.content}
                </div>
                
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {msg.groundingSources.map((source, i) => (
                      <a
                        key={i}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#2f2f2f] hover:bg-[#3e3e3e] px-2 py-1 rounded-md text-[11px] text-zinc-400 transition-colors border border-white/5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#19c37d] flex items-center justify-center animate-pulse">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-32" />
        </div>
      </div>

      {/* Docked Bottom Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-10 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="relative flex items-end bg-[#2f2f2f] rounded-[26px] border border-white/5 focus-within:border-white/20 transition-all p-2 pr-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message Gemini..."
              rows={1}
              className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:ring-0 resize-none max-h-52 placeholder-zinc-500"
              style={{ height: 'auto' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-xl transition-all ${
                input.trim() && !isLoading 
                ? 'bg-white text-black' 
                : 'bg-zinc-700 text-zinc-500'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5 font-bold" />
              )}
            </button>
          </form>
          <p className="text-[11px] text-center text-zinc-500 mt-3">
            Gemini can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
