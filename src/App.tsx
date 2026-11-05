import React, { useState, useEffect } from 'react';
import { Navigation, ScreenId, UserRole } from './components/Navigation';
import { CorkboardView } from './components/views/CorkboardView';
import { ChatDocView } from './components/views/ChatDocView';
import { OnboardingView } from './components/views/OnboardingView';
import { PomodoroPlanView } from './components/views/PomodoroPlanView';
import { MotivationView } from './components/views/MotivationView';
import { InstitutionalDashboardView } from './components/views/InstitutionalDashboardView';
import { DocenteAnalyticsView } from './components/views/DocenteAnalyticsView';
import { PythonUmlView } from './components/views/PythonUmlView';
import { ESTUDIANTE_INICIAL } from './data/initialData';
import { PerfilEstudioData } from './logic/doceCore';
import { Sparkles, X, CheckCircle, GraduationCap } from 'lucide-react';
import { ASSETS } from './data/assets';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('corkboard');
  const [userRole, setUserRole] = useState<UserRole>('estudiante');
  const [perfilEstudio, setPerfilEstudio] = useState<PerfilEstudioData>(ESTUDIANTE_INICIAL.perfilEstudio);
  const [quickDocPrompt, setQuickDocPrompt] = useState<string>('');
  const [showQuickDocModal, setShowQuickDocModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check url params for autostart or specific view
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen') as ScreenId;
    if (screenParam && ['corkboard', 'chat', 'onboarding', 'pomodoro', 'motivation', 'tutor', 'docente', 'uml'].includes(screenParam)) {
      setCurrentScreen(screenParam);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenDocWithPrompt = (prompt?: string) => {
    if (prompt) {
      setQuickDocPrompt(prompt);
    }
    setCurrentScreen('chat');
  };

  const handleOpenQuickModal = () => {
    setShowQuickDocModal(true);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'corkboard':
        return (
          <CorkboardView
            onOpenDoc={(prompt) => handleOpenDocWithPrompt(prompt)}
            onOpenPomodoro={() => setCurrentScreen('pomodoro')}
            onOpenMotivation={() => setCurrentScreen('motivation')}
          />
        );
      case 'chat':
        return (
          <ChatDocView
            initialPrompt={quickDocPrompt}
            onStart15MinPomodoro={() => setCurrentScreen('pomodoro')}
            onNavigateToUml={() => setCurrentScreen('uml')}
            onNavigateToMockups={() => setCurrentScreen('corkboard')}
          />
        );
      case 'onboarding':
        return (
          <OnboardingView
            initialPerfil={perfilEstudio}
            onSavePerfil={(newPerfil) => {
              setPerfilEstudio(newPerfil);
              showToast('Perfil de estudio actualizado. DOC ajustó tus recomendaciones.');
            }}
            onNavigateToCursada={() => setCurrentScreen('pomodoro')}
          />
        );
      case 'pomodoro':
        return (
          <PomodoroPlanView
            onAskDocHelp={(materia) => {
              handleOpenDocWithPrompt(`Ayúdame a desglosar los temas complejos de ${materia} en 3 puntos clave.`);
            }}
            onRecordVictory={(titulo) => {
              showToast(`🌟 Micro-victoria registrada: "${titulo}"`);
            }}
          />
        );
      case 'motivation':
        return (
          <MotivationView
            onTalkToDoc={() => handleOpenDocWithPrompt("¡Hola DOC! Quiero revisar mis metas y celebrar mis avances.")}
          />
        );
      case 'tutor':
        return <InstitutionalDashboardView />;
      case 'docente':
        return <DocenteAnalyticsView />;
      case 'uml':
        return <PythonUmlView />;
      default:
        return (
          <CorkboardView
            onOpenDoc={(prompt) => handleOpenDocWithPrompt(prompt)}
            onOpenPomodoro={() => setCurrentScreen('pomodoro')}
            onOpenMotivation={() => setCurrentScreen('motivation')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Institutional Top Bar */}
      <Navigation
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userRole={userRole}
        onChangeRole={setUserRole}
        onOpenQuickDoc={handleOpenQuickModal}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderActiveScreen()}
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              12
            </div>
            <div>
              <span className="font-semibold text-slate-700">DOCE (Data Orientado Compañero de Estudio)</span>
              <span className="mx-1.5">·</span>
              <span>IFTS N.° 12 — Grupo 6</span>
            </div>
          </div>

          <div className="text-center sm:text-right italic">
            “DOCE: un compañero para estudiar y una herramienta para acompañar”
          </div>
        </div>
      </footer>

      {/* Quick DOC Floating Assistant Modal */}
      {showQuickDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-50 border border-emerald-200">
                  <img
                    src={ASSETS.docMascot}
                    alt="DOC"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-heading text-slate-900">
                    Compañero Digital DOC
                  </h3>
                  <span className="text-[11px] text-emerald-700">Respuestas en menos de 180 palabras</span>
                </div>
              </div>
              <button
                onClick={() => setShowQuickDocModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                aria-label="Cerrar modal de DOC"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed">
              “¡Hola! Reconozco todo el esfuerzo que le ponés a la cursada. ¿Tenés un texto largo para desglosar en 3 puntos o sentís desánimo con las entregas? Estoy acá para acompañarte sin presiones.”
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowQuickDocModal(false);
                  handleOpenDocWithPrompt("Siento desánimo y me cuesta arrancar con el TP.");
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 text-xs font-medium border border-slate-200 transition-colors"
              >
                😔 “Siento desánimo, ¿hacemos 15 minutos juntos?”
              </button>
              <button
                onClick={() => {
                  setShowQuickDocModal(false);
                  handleOpenDocWithPrompt("Desglosame este apunte de clase en exactamente 3 puntos clave: ");
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 text-xs font-medium border border-slate-200 transition-colors"
              >
                📖 “Desglosar un texto largo en 3 puntos clave”
              </button>
              <button
                onClick={() => {
                  setShowQuickDocModal(false);
                  setCurrentScreen('pomodoro');
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 text-xs font-medium border border-slate-200 transition-colors"
              >
                ⏱️ “Iniciar bloque Pomodoro adaptativo de 15 minutos”
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setShowQuickDocModal(false);
                  setCurrentScreen('chat');
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
              >
                Ir al Chat Completo de DOC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-xs flex items-center gap-2 border border-slate-800 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
