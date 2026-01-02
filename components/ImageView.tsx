
import React, { useState } from 'react';
import { generateImage } from '../services/gemini';
import { GeneratedImage } from '../types';
// Add missing Image icon import and alias it as ImageIcon
import { Sparkles, Download, Wand2, History, Loader2, Maximize2, Image as ImageIcon } from 'lucide-react';

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(prompt);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now()
      };
      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-6xl mx-auto w-full gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left: Input & History */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Wand2 className="w-5 h-5" />
              <h2 className="font-bold">Creator Studio</h2>
            </div>
            <form onSubmit={handleGenerate} className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 resize-none transition-all"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Forging Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Art
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-400 px-2">
              <History className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Recent Creations</h3>
            </div>
            <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pr-2">
              {history.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    currentImage?.id === img.id ? 'border-blue-600' : 'border-transparent hover:border-white/20'
                  }`}
                >
                  <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                </button>
              ))}
              {history.length === 0 && (
                <div className="col-span-2 h-24 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-xs text-gray-600">
                  Empty History
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Display */}
        <div className="lg:col-span-8 glass rounded-3xl overflow-hidden flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-black/40 p-8 relative group">
            {currentImage ? (
              <>
                <img 
                  src={currentImage.url} 
                  alt={currentImage.prompt} 
                  className="max-h-full max-w-full rounded-2xl shadow-2xl object-contain shadow-blue-900/10"
                />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <a 
                    href={currentImage.url} 
                    download={`gemini-art-${currentImage.id}.png`}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-white transition-colors"
                   >
                    <Download className="w-5 h-5" />
                   </a>
                   <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-white transition-colors">
                    <Maximize2 className="w-5 h-5" />
                   </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-white/5 p-8 rounded-full inline-block">
                  <ImageIcon className="w-16 h-16 text-gray-700" />
                </div>
                <p className="text-gray-500 font-medium">Your creation will appear here</p>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-blue-400 font-bold animate-pulse">Consulting the latent space...</p>
                </div>
              </div>
            )}
          </div>
          
          {currentImage && (
            <div className="p-6 border-t border-white/10 glass">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Active Prompt</p>
                  <p className="text-sm text-gray-300 italic">"{currentImage.prompt}"</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Model</p>
                  <p className="text-xs text-gray-400">Gemini 2.5 Flash Image</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ImageView;
