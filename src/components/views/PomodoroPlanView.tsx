import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, CheckCircle2, Circle, Sparkles, BookOpen, ChevronRight, Award, Plus } from 'lucide-react';
import { CursadaData } from '../../logic/doceCore';
import { MicroObjetivo, CURSADAS_INICIALES, MICRO_OBJETIVOS_INICIALES } from '../../data/initialData';
import { soundEngine } from '../../utils/audioSynth';

interface PomodoroPlanViewProps {
  onAskDocHelp: (materia: string) => void;
  onRecordVictory: (titulo: string) => void;
}

export const PomodoroPlanView: React.FC<PomodoroPlanViewProps> = ({
  onAskDocHelp,
  onRecordVictory,
}) => {
  const [cursadas, setCursadas] = useState<CursadaData[]>(CURSADAS_INICIALES);
  const [microObjetivos, setMicroObjetivos] = useState<MicroObjetivo[]>(MICRO_OBJETIVOS_INICIALES);
  const [selectedMateria, setSelectedMateria] = useState<string>('DS-202');
  
  // Pomodoro states: duration in seconds
  const [pomodoroMode, setPomodoroMode] = useState<'15min' | '25min' | '5minBreak'>('15min');
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>('obj-1');

  // Set duration when mode changes
  const handleSelectMode = (mode: '15min' | '25min' | '5minBreak') => {
    setIsRunning(false);
    setPomodoroMode(mode);
    if (mode === '15min') setTimeLeft(15 * 60);
    else if (mode === '25min') setTimeLeft(25 * 60);
    else if (mode === '5minBreak') setTimeLeft(5 * 60);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      soundEngine.playChime();
      
      // Si había tarea activa, ofrecer registrar micro-victoria
      const currentTask = microObjetivos.find(t => t.id === activeTaskId);
      if (currentTask) {
        onRecordVictory(`Completé bloque de concentración: ${currentTask.titulo}`);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, activeTaskId, microObjetivos, onRecordVictory]);

  const toggleTask = (id: string) => {
    setMicroObjetivos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completado;
          if (nextState) {
            onRecordVictory(`Micro-objetivo cumplido: ${t.titulo}`);
          }
          return { ...t, completado: nextState };
        }
        return t;
      })
    );
  };

  const handleStartTaskTimer = (task: MicroObjetivo) => {
    setActiveTaskId(task.id);
    if (task.duracionMinutos === 15) {
      handleSelectMode('15min');
    } else {
      handleSelectMode('25min');
    }
    setIsRunning(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeTask = microObjetivos.find((t) => t.id === activeTaskId);
  const activeMateria = cursadas.find((c) => c.codigoMateria === selectedMateria);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <span>Pantalla 4</span>
          <span>·</span>
          <span>Plan de Cursada & Pomodoro Adaptativo</span>
          <span>·</span>
          <span>IFTS N.° 12</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
          Micro-Objetivos y Bloques de Concentración
        </h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-3xl">
          Dividir una materia pesada en micro-objetivos de 15 a 25 minutos es el método pedagógico comprobado para evitar la frustración y la deserción escolar. No mires toda la montaña; mirá solo el próximo bloque.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pomodoro Adaptativo Widget */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Temporizador Pomodoro Adaptativo
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl w-full max-w-xs mb-6">
              <button
                onClick={() => handleSelectMode('15min')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  pomodoroMode === '15min'
                    ? 'bg-white text-emerald-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                15 min (Ágil)
              </button>
              <button
                onClick={() => handleSelectMode('25min')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  pomodoroMode === '25min'
                    ? 'bg-white text-emerald-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                25 min (Clásico)
              </button>
              <button
                onClick={() => handleSelectMode('5minBreak')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  pomodoroMode === '5minBreak'
                    ? 'bg-white text-cyan-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5 min (Pausa)
              </button>
            </div>

            {/* Large Digital Clock Dial */}
            <div className="relative w-56 h-56 rounded-full border-8 border-emerald-100 flex flex-col items-center justify-center bg-slate-50 shadow-inner mb-6">
              <div className="text-5xl font-mono font-bold text-slate-900 tracking-tighter tabular-nums">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                {pomodoroMode === '5minBreak' ? '☕ Pausa reparadora' : '🎯 Enfoque activo'}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-colors ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Comenzar Bloque</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  handleSelectMode(pomodoroMode);
                }}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                title="Reiniciar reloj"
                aria-label="Reiniciar temporizador"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Active task in focus */}
            {activeTask && (
              <div className="mt-6 pt-4 border-t border-slate-100 w-full text-left">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                  Foco actual
                </span>
                <p className="text-xs text-slate-800 font-medium mt-0.5">
                  {activeTask.titulo}
                </p>
              </div>
            )}
          </div>

          {/* Pedagogy Note from DOC */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Consejo de DOC para días con cansancio:</strong> “Si tuviste un día laboral pesado, no te exijas sesiones de 2 horas. Un bloque único de 15 minutos mantiene tu cerebro conectado y previene el abandono de la cursada.”
            </div>
          </div>
        </div>

        {/* Right Column: Materias & Micro-Objetivos */}
        <div className="lg:col-span-7 space-y-6">
          {/* Materias Selector Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold font-heading text-slate-900">
                Materias en Curso (IFTS 12)
              </h2>
              <span className="text-xs text-slate-500 font-medium">Ciclo Lectivo 2024</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {cursadas.map((m) => (
                <button
                  key={m.codigoMateria}
                  onClick={() => setSelectedMateria(m.codigoMateria)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMateria === m.codigoMateria
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-500">{m.codigoMateria}</div>
                  <div className="text-xs font-bold font-heading truncate mt-0.5">{m.nombreMateria}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                    {m.porcentajeAvance}% avance
                  </div>
                </button>
              ))}
            </div>

            {/* Materia Detail & Micro-Objetivos */}
            {activeMateria && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 font-heading">
                      {activeMateria.nombreMateria}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Asistencia: {activeMateria.asistenciaPorcentaje}% · Entregas pendientes: {activeMateria.entregasAtrasadas}
                    </div>
                  </div>

                  <button
                    onClick={() => onAskDocHelp(activeMateria.nombreMateria)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Desglosar temas con DOC</span>
                  </button>
                </div>

                {/* List of Micro-Objetivos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Micro-Objetivos de Estudio
                    </span>
                    <span className="text-xs text-slate-500">
                      {microObjetivos.filter((t) => t.completado).length} de {microObjetivos.length} listos
                    </span>
                  </div>

                  <div className="space-y-2">
                    {microObjetivos.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                          task.completado
                            ? 'bg-slate-50/70 border-slate-200 text-slate-400 line-through'
                            : activeTaskId === task.id
                            ? 'bg-emerald-50/50 border-emerald-300 text-slate-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="text-emerald-600 hover:text-emerald-700 shrink-0"
                            aria-label={task.completado ? 'Marcar incompleto' : 'Marcar completado'}
                          >
                            {task.completado ? (
                              <CheckCircle2 className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                            )}
                          </button>
                          <span className="text-xs sm:text-sm font-medium truncate">
                            {task.titulo}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {task.duracionMinutos} min
                          </span>
                          {!task.completado && (
                            <button
                              onClick={() => handleStartTaskTimer(task)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span className="hidden sm:inline">Enfocar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
