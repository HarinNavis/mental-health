import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Heart, 
  Wind, 
  Sparkles, 
  ShieldAlert, 
  MessageCircle, 
  Info,
  ChevronRight,
  RefreshCw,
  Anchor
} from 'lucide-react';
import Markdown from 'react-markdown';
import { HavenAI } from './services/havenAI';
import { cn } from './lib/utils';
import { BreathingExercise, Grounding54321 } from './components/Tools';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello. I'm Haven, a compassionate space for you to share whatever is on your mind. How are you feeling in this moment?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [showCrisisInfo, setShowCrisisInfo] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HavenAI | null>(null);

  useEffect(() => {
    try {
      aiRef.current = new HavenAI();
    } catch (e) {
      console.error("Failed to initialize AI", e);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !aiRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }]);

    try {
      await aiRef.current.sendMessageStream(input, (fullText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? { ...msg, content: fullText } : msg
        ));
      });
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? { ...msg, content: "I'm sorry, I encountered an error. Please try again or reach out to a professional if you're in distress." } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-haven-bg text-haven-ink selection:bg-haven-accent/10">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-haven-bg/80 backdrop-blur-md border-b border-haven-soft px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-haven-accent rounded-2xl flex items-center justify-center shadow-lg shadow-haven-accent/20">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold tracking-tight">Haven</h1>
            <p className="text-[10px] uppercase tracking-widest text-haven-ink/40 font-medium">Emotional Support Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCrisisInfo(!showCrisisInfo)}
            className="p-2 rounded-xl hover:bg-red-50 text-red-500/60 hover:text-red-500 transition-all flex items-center gap-2 text-sm font-medium"
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="hidden sm:inline">Crisis Resources</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col relative">
        {/* Crisis Banner */}
        <AnimatePresence>
          {showCrisisInfo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-red-50 border-b border-red-100"
            >
              <div className="p-6 text-sm text-red-800 space-y-3">
                <p className="font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  If you are in immediate danger, please call emergency services right now.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/50 p-3 rounded-lg border border-red-200">
                    <p className="font-medium mb-1">United States</p>
                    <p>Call or text <span className="font-bold">988</span> (Suicide & Crisis Lifeline)</p>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg border border-red-200">
                    <p className="font-medium mb-1">International</p>
                    <p>Contact your local emergency services or a local crisis center.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCrisisInfo(false)}
                  className="text-red-600 underline text-xs font-medium"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          {messages.map((msg, idx) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "px-5 py-4 rounded-3xl",
                msg.role === 'user' 
                  ? "bg-haven-accent text-white rounded-tr-none shadow-md" 
                  : "bg-white border border-haven-soft rounded-tl-none shadow-sm"
              )}>
                {msg.role === 'assistant' ? (
                  <div className="markdown-body">
                    <Markdown>{msg.content}</Markdown>
                    {isLoading && msg.id === messages[messages.length - 1].id && !msg.content && (
                      <div className="flex gap-1 mt-2">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-haven-accent rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-haven-accent rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-haven-accent rounded-full" />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-lg leading-relaxed">{msg.content}</p>
                )}
              </div>
              <span className="text-[10px] text-haven-ink/30 mt-2 font-medium uppercase tracking-wider">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Tools */}
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          <button 
            onClick={() => setShowBreathing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-haven-soft rounded-full text-sm font-medium text-haven-accent hover:bg-haven-soft transition-colors shadow-sm"
          >
            <Wind className="w-4 h-4" />
            Breathing Exercise
          </button>
          <button 
            onClick={() => setShowGrounding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-haven-soft rounded-full text-sm font-medium text-haven-accent hover:bg-haven-soft transition-colors shadow-sm"
          >
            <Anchor className="w-4 h-4" />
            5-4-3-2-1 Grounding
          </button>
          <button 
            onClick={() => setInput("Can you give me a journaling prompt?")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-haven-soft rounded-full text-sm font-medium text-haven-accent hover:bg-haven-soft transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Journaling Prompt
          </button>
        </div>

        {/* Input Area */}
        <div className="p-6 pt-2">
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Share what's on your mind..."
              className="w-full bg-white border border-haven-soft rounded-[2rem] px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-haven-accent/20 focus:border-haven-accent transition-all resize-none shadow-lg shadow-haven-accent/5 min-h-[60px] max-h-[200px]"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-3 bottom-3 p-3 rounded-full transition-all",
                input.trim() && !isLoading 
                  ? "bg-haven-accent text-white shadow-lg shadow-haven-accent/30 hover:scale-105 active:scale-95" 
                  : "bg-haven-soft text-haven-ink/20 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-haven-ink/30 mt-4 font-medium uppercase tracking-widest">
            Haven is an AI assistant, not a replacement for professional therapy.
          </p>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
        {showGrounding && <Grounding54321 onClose={() => setShowGrounding(false)} />}
      </AnimatePresence>
    </div>
  );
}
