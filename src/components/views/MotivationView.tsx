import React from 'react';
import { Award, Zap, Flame, Clock, Users, GraduationCap, TrendingUp, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { Insignia, INSIGNIAS_INICIALES } from '../../data/initialData';

interface MotivationViewProps {
  onTalkToDoc: () => void;
}

export const MotivationView: React.FC<MotivationViewProps> = ({ onTalkToDoc }) => {
  const insignias = INSIGNIAS_INICIALES;
  const insigniasObtenidas = insignias.filter((i) => i.obtenida).length;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-emerald-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-cyan-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      default:
        return <Award className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <span>Pantalla 5</span>
          <span>·</span>
          <span>Motivación & Visión a Futuro</span>
          <span>·</span>
          <span>IFTS N.° 12</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
          Tu Camino Hacia el Título Técnico
        </h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-3xl">
          DOCE no utiliza rankings competitivos ni castigos. Te comparamos únicamente contra tu propio punto de partida: cada micro-paso cuenta y consolida tu trayectoria hacia la graduación.
        </p>
      </div>

      {/* Historical Reconforting Comparison Card */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Comparativa Histórica Personal (Tu Yo de Marzo vs Tu Yo de Hoy)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-heading mb-4 text-emerald-50">
          “Empezaste con incertidumbre, hoy ya tenés 4 materias encauzadas”
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-emerald-800/60">
          <div className="space-y-1">
            <div className="text-xs text-emerald-300">Tiempo de Estudio Sostenido</div>
            <div className="text-2xl font-bold font-mono">4.5 hs / semana</div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              En marzo comenzaste con sesiones de 30 min esporádicas. Hoy sostenés micro-bloques regulares en el tren y en tu casa.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-emerald-300">Resiliencia ante Bloqueos</div>
            <div className="text-2xl font-bold font-mono">12 síntesis con DOC</div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              En lugar de frustrarte y abandonar la lectura, desglosaste temas en 3 puntos clave y entregaste los TPs.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-emerald-300">Progreso de Carrera (IFTS 12)</div>
            <div className="text-2xl font-bold font-mono">68.7% Global</div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Estás a menos de 2 cuatrimestres de completar la Tecnicatura Superior en Desarrollo de Software.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-emerald-800/60 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-emerald-200 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Recordatorio: El ritmo propio es el único ritmo que garantiza la permanencia.</span>
          </div>

          <button
            onClick={onTalkToDoc}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Conversar con DOC sobre mis metas</span>
          </button>
        </div>
      </div>

      {/* Insignias de Esfuerzo Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold font-heading text-slate-900">
              Insignias de Reconocimiento al Esfuerzo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Distinciones basadas en constancia, superación de trabas y hábitos saludables.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {insigniasObtenidas} de {insignias.length} desbloqueadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insignias.map((ins) => (
            <div
              key={ins.id}
              className={`p-5 rounded-xl border transition-all ${
                ins.obtenida
                  ? 'bg-slate-50/70 border-slate-200 shadow-xs'
                  : 'bg-white border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    ins.obtenida ? 'bg-white shadow-xs border border-slate-100' : 'bg-slate-100'
                  }`}
                >
                  {getIcon(ins.icono)}
                </div>
                {ins.obtenida ? (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Desbloqueada {ins.fecha}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400">
                    En progreso
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-slate-900 font-heading">{ins.titulo}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ins.descripcion}</p>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Categoría: {ins.categoria}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
