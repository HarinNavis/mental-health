import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Circle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function BreathingExercise({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') { setPhase('Hold'); return 4; }
          if (phase === 'Hold') { setPhase('Exhale'); return 4; }
          if (phase === 'Exhale') { setPhase('Pause'); return 4; }
          if (phase === 'Pause') { setPhase('Inhale'); return 4; }
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-haven-bg/90 backdrop-blur-sm p-6"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-12 shadow-2xl border border-haven-soft flex flex-col items-center text-center">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-haven-soft transition-colors"
        >
          <X className="w-6 h-6 text-haven-ink/40" />
        </button>

        <Wind className="w-8 h-8 text-haven-accent mb-8" />
        
        <div className="relative w-48 h-48 flex items-center justify-center mb-12">
          <motion.div 
            animate={{ 
              scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : phase === 'Hold' ? 1.5 : 1,
              opacity: phase === 'Inhale' ? 0.8 : phase === 'Exhale' ? 0.4 : 0.8
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 bg-haven-accent/20 rounded-full"
          />
          <div className="z-10 text-4xl font-serif text-haven-accent">
            {timer}
          </div>
        </div>

        <h3 className="text-2xl font-serif mb-2">{phase}</h3>
        <p className="text-haven-ink/60 max-w-[200px]">
          {phase === 'Inhale' && 'Breathe in slowly through your nose.'}
          {phase === 'Hold' && 'Gently hold your breath.'}
          {phase === 'Exhale' && 'Exhale slowly through your mouth.'}
          {phase === 'Pause' && 'Rest for a moment.'}
        </p>
      </div>
    </motion.div>
  );
}

export function Grounding54321({ onClose }: { onClose: () => void }) {
  const steps = [
    { label: '5 things you can see', icon: '👁️' },
    { label: '4 things you can touch', icon: '✋' },
    { label: '3 things you can hear', icon: '👂' },
    { label: '2 things you can smell', icon: '👃' },
    { label: '1 thing you can taste', icon: '👅' },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-haven-bg/90 backdrop-blur-sm p-6"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl border border-haven-soft">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-haven-soft transition-colors"
        >
          <X className="w-6 h-6 text-haven-ink/40" />
        </button>

        <div className="mb-8">
          <h3 className="text-2xl font-serif mb-2">5-4-3-2-1 Grounding</h3>
          <p className="text-haven-ink/60 text-sm">Focus on your surroundings to calm your mind.</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={false}
              animate={{ 
                opacity: currentStep >= idx ? 1 : 0.3,
                scale: currentStep === idx ? 1.02 : 1,
                x: currentStep === idx ? 10 : 0
              }}
              className={cn(
                "p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4",
                currentStep === idx ? "border-haven-accent bg-haven-soft/50 shadow-sm" : "border-transparent"
              )}
            >
              <span className="text-2xl">{step.icon}</span>
              <span className={cn("font-medium", currentStep === idx ? "text-haven-ink" : "text-haven-ink/40")}>
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex gap-3">
          {currentStep < steps.length - 1 ? (
            <button 
              onClick={() => setCurrentStep(s => s + 1)}
              className="flex-1 bg-haven-accent text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="flex-1 bg-haven-accent text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              I feel more grounded
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
