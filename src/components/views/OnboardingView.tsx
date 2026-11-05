import React, { useState } from 'react';
import { User, Briefcase, Car, Users, Activity, CheckCircle, ShieldCheck, ArrowRight, HeartHandshake } from 'lucide-react';
import { PerfilEstudioData, EvaluadorPerfilEstudio } from '../../logic/doceCore';

interface OnboardingViewProps {
  initialPerfil: PerfilEstudioData;
  onSavePerfil: (perfil: PerfilEstudioData) => void;
  onNavigateToCursada: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  initialPerfil,
  onSavePerfil,
  onNavigateToCursada,
}) => {
  const [perfil, setPerfil] = useState<PerfilEstudioData>(initialPerfil);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const ritmos: Array<{ id: PerfilEstudioData['preferenciaRitmo']; label: string; desc: string; emoji: string }> = [
    {
      id: 'Visual-Sintético',
      label: 'Visual-Sintético',
      desc: 'Prefiero diagramas, mapas conceptuales, código comentado y desgloses directos en 3 puntos.',
      emoji: '👁️',
    },
    {
      id: 'Enfoque en Bloques',
      label: 'Enfoque en Bloques',
      desc: 'Estudio mejor en intervalos breves e intensos de 15 a 25 minutos con pausas obligatorias.',
      emoji: '⏱️',
    },
    {
      id: 'Auditivo-Práctico',
      label: 'Auditivo-Práctico',
      desc: 'Aprendo escuchando debates, explicaciones de pares y practicando ejercicios inmediatamente.',
      emoji: '🎧',
    },
    {
      id: 'Lectura Reflexiva',
      label: 'Lectura Reflexiva',
      desc: 'Necesito leer los apuntes a mi propio ritmo antes de lanzarme a programar o responder.',
      emoji: '📖',
    },
  ];

  const evaluacion = EvaluadorPerfilEstudio.esVulnerable(perfil);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePerfil(perfil);
    setGuardadoExitoso(true);
    setTimeout(() => setGuardadoExitoso(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <span>Pantalla 3</span>
          <span>·</span>
          <span>Onboarding & Perfil de Estudiante</span>
          <span>·</span>
          <span>Sin Etiquetas Estigmatizantes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
          Personalizá tu Ritmo de Estudio
        </h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
          En el IFTS N.° 12 sabemos que la mayoría de los estudiantes trabajan, viajan largas horas y tienen responsabilidades familiares. DOC no te juzga ni te pone notas de conducta: adapta los micro-objetivos a tu realidad real.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Estilos de Aprendizaje */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold font-heading text-slate-900 mb-1 flex items-center gap-2">
            <span>1. ¿Cómo te resulta más cómodo aprender?</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Seleccioná la modalidad que mejor se adapte a tu día a día (podés cambiarla cuando quieras).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ritmos.map((item) => {
              const isSelected = perfil.preferenciaRitmo === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPerfil({ ...perfil, preferenciaRitmo: item.id })}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {isSelected ? '✓ Seleccionado' : 'Elegir'}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 font-heading">{item.label}</div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Realidad Socio-Laboral */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-heading text-slate-900 mb-1">
              2. Tu Carga Cotidiana (Datos Protegidos)
            </h2>
            <p className="text-xs text-slate-500">
              Estas variables permiten al sistema calibrar los tiempos sugeridos de descanso y sugerir tutorías personalizadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carga Horaria Laboral */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Carga Horaria de Trabajo</span>
                </label>
                <span className="text-sm font-bold font-mono text-emerald-800 tabular-nums">
                  {perfil.cargaHorariaTrabajo} hs / semana
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={perfil.cargaHorariaTrabajo}
                onChange={(e) => setPerfil({ ...perfil, cargaHorariaTrabajo: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0 hs (Ded. exclusiva)</span>
                <span>20 hs (Part-time)</span>
                <span>40+ hs (Full-time)</span>
              </div>
            </div>

            {/* Horas de Traslado Diario */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>Horas de Traslado Diario (Ida y Vuelta)</span>
                </label>
                <span className="text-sm font-bold font-mono text-emerald-800 tabular-nums">
                  {perfil.horasTraslado} hs / día
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={perfil.horasTraslado}
                onChange={(e) => setPerfil({ ...perfil, horasTraslado: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0 hs (Cerca)</span>
                <span>2 hs (Promedio CABA)</span>
                <span>4+ hs (Larga distancia)</span>
              </div>
            </div>

            {/* Personas a Cargo */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Personas a Cargo (Hijos / Familiares)</span>
                </label>
                <span className="text-sm font-bold font-mono text-emerald-800 tabular-nums">
                  {perfil.personasACargo} {perfil.personasACargo === 1 ? 'persona' : 'personas'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={perfil.personasACargo}
                onChange={(e) => setPerfil({ ...perfil, personasACargo: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Sin familiares dependientes</span>
                <span>1 a 2</span>
                <span>3 o más</span>
              </div>
            </div>

            {/* Nivel de Estrés Autoreportado */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Nivel de Fatiga / Estrés Autoreportado</span>
                </label>
                <span className="text-sm font-bold font-mono text-emerald-800 tabular-nums">
                  {perfil.nivelEstres} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={perfil.nivelEstres}
                onChange={(e) => setPerfil({ ...perfil, nivelEstres: Number(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1 (Tranquilo)</span>
                <span>5 (Manejable)</span>
                <span>10 (Sobrecargado)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pedagogical Transparency & Evaluation Deck */}
        <div className="p-6 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-sm text-emerald-950 font-heading">
                Garantía Ética DOCE: Orientación Proactiva, Cero Punición
              </h3>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-2xl">
              {evaluacion.esVulnerable
                ? `Prioridad de Acompañamiento: ${evaluacion.nivelPrioridad}. Identificamos factores de alta exigencia diaria (${evaluacion.motivos.join(', ')}). DOC te sugerirá micro-metas de 15 minutos y avisará a Tutoría de forma anónima para brindarte apoyo académico prioritario sin ninguna penalización.`
                : 'Tu perfil muestra condiciones de tiempo estables. DOC mantendrá tu ritmo con recordatorios positivos y pausas activas.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Guardar Perfil</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToCursada}
              className="px-4 py-2.5 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Ver Cursada</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {guardadoExitoso && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>Perfil actualizado con éxito en la plataforma DOCE del IFTS N.° 12.</span>
          </div>
        )}
      </form>
    </div>
  );
};
