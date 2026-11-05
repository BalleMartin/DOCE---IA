import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Sparkles, Volume2, VolumeX, Flame, Clock, Heart, Award } from 'lucide-react';
import { StickyNote, NOTAS_CORCHO_INICIALES } from '../../data/initialData';
import { ASSETS } from '../../data/assets';
import { soundEngine } from '../../utils/audioSynth';

interface CorkboardViewProps {
  onOpenDoc: (initialPrompt?: string) => void;
  onOpenPomodoro: () => void;
  onOpenMotivation: () => void;
}

export const CorkboardView: React.FC<CorkboardViewProps> = ({
  onOpenDoc,
  onOpenPomodoro,
  onOpenMotivation,
}) => {
  const [notes, setNotes] = useState<StickyNote[]>(NOTAS_CORCHO_INICIALES);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<StickyNote['tipo']>('victoria');
  const [newColor, setNewColor] = useState<StickyNote['color']>('amber');
  
  // Ambient sound local state
  const [activeSound, setActiveSound] = useState<'lofi' | 'rain' | 'coffee' | 'none'>('none');

  const toggleSound = (sound: 'lofi' | 'rain' | 'coffee') => {
    if (activeSound === sound) {
      soundEngine.stop();
      setActiveSound('none');
    } else {
      soundEngine.playSound(sound);
      setActiveSound(sound);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newNote: StickyNote = {
      id: `nota-${Date.now()}`,
      tipo: newType,
      color: newColor,
      titulo: newTitle.trim() || (newType === 'victoria' ? '🌟 Micro-Victoria' : '📌 Nota'),
      contenido: newContent.trim(),
      fecha: 'Recién',
      rotacion: (Math.random() * 4 - 2), // Entre -2 y 2 grados
    };

    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const getColorClasses = (color: StickyNote['color']) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-emerald-900/10';
      case 'cyan':
        return 'bg-sky-50 text-sky-950 border-sky-300 shadow-sky-900/10';
      case 'rose':
        return 'bg-rose-50 text-rose-950 border-rose-300 shadow-rose-900/10';
      case 'violet':
        return 'bg-purple-50 text-purple-950 border-purple-300 shadow-purple-900/10';
      case 'amber':
      default:
        return 'bg-amber-50 text-amber-950 border-amber-300 shadow-amber-900/10';
    }
  };

  const microVictoriasCount = notes.filter(n => n.tipo === 'victoria').length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Sanctuary Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                <span>Pantalla 1</span>
                <span>·</span>
                <span>Refugio de Estudio Personal</span>
                <span>·</span>
                <span>IFTS N.° 12</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight leading-snug">
                Tablero de Corcho Virtual: Tu Espacio Seguro
              </h1>
              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                Este es tu refugio de estudio libre de presiones. Acá anotás tus micro-victorias cotidianas, metas de la semana y consejos pedagógicos de DOC.
              </p>
            </div>

            {/* Quick Metrics Bar without static pills */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-slate-500 font-medium">Micro-Victorias</div>
                <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums flex items-center gap-1.5 mt-0.5">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>{microVictoriasCount} logradas</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Ritmo Recomendado</div>
                <div className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Bloques de 15 min</span>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-xs text-slate-500 font-medium">Lema DOCE</div>
                <div className="text-xs font-medium text-slate-700 italic mt-1">
                  “Un compañero para estudiar, herramienta para acompañar”
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-slate-100">
            <img
              src={ASSETS.corkboardHaven}
              alt="Rincón de estudio acogedor con corcho y apuntes"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex items-end p-5">
              <div className="text-white text-xs">
                <span className="font-semibold block text-sm">Refugio de concentración</span>
                <span className="opacity-90">Creado para el estudiante trabajador del IFTS 12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip: Actions & Ambient Sound Widget */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Pinchar Nota en el Corcho</span>
          </button>

          <button
            onClick={() => onOpenDoc("¡Hola DOC! ¿Me das una palabra de aliento para encarar el estudio hoy?")}
            className="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pedir aliento a DOC</span>
          </button>
        </div>

        {/* Ambient Sound Widget: Lo-Fi, Rain, Coffee */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">Audio ambiental:</span>
          <div className="flex items-center p-1 bg-slate-100 rounded-lg gap-1">
            <button
              onClick={() => toggleSound('rain')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSound === 'rain'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌧️ Lluvia
            </button>
            <button
              onClick={() => toggleSound('lofi')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSound === 'lofi'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎧 Lo-Fi
            </button>
            <button
              onClick={() => toggleSound('coffee')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSound === 'coffee'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ☕ Café
            </button>
            {activeSound !== 'none' && (
              <button
                onClick={() => {
                  soundEngine.stop();
                  setActiveSound('none');
                }}
                className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Detener audio"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Realistic Corkboard Virtual Surface */}
      <div className="p-6 sm:p-8 rounded-2xl bg-corkboard border-8 border-amber-900/30 shadow-inner min-h-[480px]">
        {/* Corkboard Top Plaque */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-amber-950/20">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-950/80 bg-amber-100/90 px-3 py-1 rounded shadow-sm border border-amber-200">
            📌 Tablero de Corcho · Grupo 6 IFTS 12
          </div>
          <div className="text-xs text-amber-950/70 font-medium hidden sm:block">
            Haz clic en "Pinchar Nota" para sumar tus avances diarios
          </div>
        </div>

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => {
            const rotStyle = {
              transform: `rotate(${note.rotacion || 0}deg)`,
            };

            return (
              <div
                key={note.id}
                style={rotStyle}
                className={`p-5 rounded-lg border-2 shadow-md hover:shadow-xl transition-all duration-200 relative group ${getColorClasses(
                  note.color
                )}`}
              >
                {/* Visual Pushpin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-600 shadow-sm border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-rose-200 rounded-full"></div>
                </div>

                <div className="flex items-start justify-between gap-2 mt-1 mb-2">
                  <h2 className="font-bold text-sm font-heading">{note.titulo}</h2>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition-opacity"
                    title="Eliminar nota"
                    aria-label={`Eliminar nota ${note.titulo}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {note.contenido}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-900/10 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>{note.fecha}</span>
                  {note.tipo === 'victoria' && (
                    <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Micro-victoria
                    </span>
                  )}
                  {note.tipo === 'doc' && (
                    <span className="flex items-center gap-1 text-amber-800 font-semibold">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Mensaje de DOC
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal to add a note */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold font-heading text-slate-900 mb-4">
              Pinchar Nueva Nota o Micro-Victoria
            </h3>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de elemento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['victoria', 'meta', 'recordatorio'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border text-center capitalize ${
                        newType === t
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t === 'victoria' ? '🌟 Victoria' : t === 'meta' ? '🎯 Meta' : '📌 Nota'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título (opcional)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Repasé 15 minutos en el colectivo"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contenido
                </label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Escribí lo que lograste hoy o lo que tenés pendiente para tu cursada..."
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Color de la nota
                </label>
                <div className="flex items-center gap-2">
                  {(['amber', 'emerald', 'cyan', 'rose', 'violet'] as const).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        col === 'amber'
                          ? 'bg-amber-200'
                          : col === 'emerald'
                          ? 'bg-emerald-200'
                          : col === 'cyan'
                          ? 'bg-sky-200'
                          : col === 'rose'
                          ? 'bg-rose-200'
                          : 'bg-purple-200'
                      } ${newColor === col ? 'scale-110 border-slate-900 ring-2 ring-slate-400' : 'border-transparent'}`}
                      aria-label={`Color ${col}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  Pinchar en Corcho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
