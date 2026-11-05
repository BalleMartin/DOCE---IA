import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Code2, ShieldAlert, GraduationCap, Compass, BookOpen, Clock, HeartHandshake } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

export type ScreenId = 
  | 'corkboard' 
  | 'chat' 
  | 'onboarding' 
  | 'pomodoro' 
  | 'motivation' 
  | 'tutor' 
  | 'docente' 
  | 'uml';

export type UserRole = 'estudiante' | 'tutor' | 'devops';

interface NavigationProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenQuickDoc: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onSelectScreen,
  userRole,
  onChangeRole,
  onOpenQuickDoc,
}) => {
  const [soundActive, setSoundActive] = useState<boolean>(false);
  const [soundType, setSoundType] = useState<'lofi' | 'rain' | 'coffee'>('rain');

  const handleToggleSound = (type?: 'lofi' | 'rain' | 'coffee') => {
    const nextType = type || soundType;
    if (soundActive && (!type || type === soundType)) {
      soundEngine.stop();
      setSoundActive(false);
    } else {
      soundEngine.playSound(nextType);
      setSoundType(nextType);
      setSoundActive(true);
    }
  };

  const navItems = [
    { id: 'corkboard' as ScreenId, label: '1. Tablero', icon: Compass },
    { id: 'chat' as ScreenId, label: '2. Chat DOC', icon: Sparkles },
    { id: 'onboarding' as ScreenId, label: '3. Onboarding', icon: BookOpen },
    { id: 'pomodoro' as ScreenId, label: '4. Pomodoro', icon: Clock },
    { id: 'motivation' as ScreenId, label: '5. Motivación', icon: HeartHandshake },
    { id: 'tutor' as ScreenId, label: '6. Tutorías', icon: ShieldAlert },
    { id: 'docente' as ScreenId, label: '7. Docente', icon: GraduationCap },
    { id: 'uml' as ScreenId, label: '8. UML & Python', icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button 
            onClick={() => onSelectScreen('corkboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              12
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 font-heading whitespace-nowrap shrink-0 block leading-tight">
                DOCE · IFTS N.° 12
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block whitespace-nowrap">
                Compañero para estudiar, herramienta para acompañar
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation links - responsive and single-line */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectScreen(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-800 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Ambient Sound Controller */}
            <div className="relative group">
              <button
                onClick={() => handleToggleSound()}
                title={soundActive ? `Pausar audio ambiental (${soundType})` : "Activar sonido ambiental (Lluvia/Lo-Fi)"}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  soundActive 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-label={soundActive ? "Pausar sonido ambiental" : "Iniciar sonido ambiental"}
              >
                {soundActive ? <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden md:inline text-xs capitalize">{soundActive ? soundType : 'Audio'}</span>
              </button>

              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 hidden group-hover:block z-50 text-xs">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase">Ambiente</div>
                <button
                  onClick={() => handleToggleSound('rain')}
                  className={`w-full text-left px-2 py-1.5 rounded ${soundActive && soundType === 'rain' ? 'bg-amber-50 text-amber-800 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  🌧️ Lluvia suave
                </button>
                <button
                  onClick={() => handleToggleSound('lofi')}
                  className={`w-full text-left px-2 py-1.5 rounded ${soundActive && soundType === 'lofi' ? 'bg-amber-50 text-amber-800 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  🎧 Pulso Lo-Fi
                </button>
                <button
                  onClick={() => handleToggleSound('coffee')}
                  className={`w-full text-left px-2 py-1.5 rounded ${soundActive && soundType === 'coffee' ? 'bg-amber-50 text-amber-800 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  ☕ Café de estudio
                </button>
              </div>
            </div>

            {/* Quick Ask DOC primary CTA */}
            <button
              onClick={onOpenQuickDoc}
              className="px-3.5 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hablar con DOC</span>
            </button>
          </div>
        </div>

        {/* Secondary Mobile & Tablet Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
                  isActive 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label.split('.')[1] || item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
