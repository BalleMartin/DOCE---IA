import React, { useState } from 'react';
import { Flame, BookOpen, Sparkles, FileText, CheckCircle, Download, RefreshCw, BarChart2 } from 'lucide-react';
import { AgenteDOC } from '../../logic/doceCore';

interface TemaCalor {
  id: string;
  materia: string;
  tema: string;
  nivelDificultad: 'Alto' | 'Medio' | 'Moderado';
  consultasDoc: number;
  porcentajeDificultad: number;
  sugerenciaDOC: string;
}

const TEMAS_MAPA_CALOR: TemaCalor[] = [
  {
    id: 't-1',
    materia: 'Sistemas Operativos (SO-102)',
    tema: 'Paginación, Tablas de Páginas y Memoria Virtual',
    nivelDificultad: 'Alto',
    consultasDoc: 48,
    porcentajeDificultad: 82,
    sugerenciaDOC: 'Muchos estudiantes se traban calculando el offset y marco de página. Conviene una guía visual con diagramas de memoria.',
  },
  {
    id: 't-2',
    materia: 'Bases de Datos I (BD-101)',
    tema: 'Normalización a Tercera Forma Normal (3FN) y Dependencias Transitivas',
    nivelDificultad: 'Alto',
    consultasDoc: 39,
    porcentajeDificultad: 76,
    sugerenciaDOC: 'Dificultad para discernir dependencias transitivas vs funcionales directas. Sugerir desglose paso a paso.',
  },
  {
    id: 't-3',
    materia: 'Algoritmos y Estructuras (AED-201)',
    tema: 'Recursividad de Cola vs Recursividad Múltiple en Árboles',
    nivelDificultad: 'Medio',
    consultasDoc: 27,
    porcentajeDificultad: 58,
    sugerenciaDOC: 'El caso base no queda claro en llamadas recursivas con retorno. Recomendado ejercicio puente de 15 min.',
  },
  {
    id: 't-4',
    materia: 'Desarrollo de Software (DS-202)',
    tema: 'Inyección de Dependencias y Arquitectura en Capas',
    nivelDificultad: 'Moderado',
    consultasDoc: 19,
    porcentajeDificultad: 42,
    sugerenciaDOC: 'Concepto bien asimilado en la mayoría, reforzar contratos de interfaces en TypeScript/Python.',
  },
];

export const DocenteAnalyticsView: React.FC = () => {
  const [selectedTema, setSelectedTema] = useState<TemaCalor>(TEMAS_MAPA_CALOR[0]);
  const [guiaGenerada, setGuiaGenerada] = useState<{
    titulo: string;
    puntos: [string, string, string];
    ejercicio: string;
  } | null>(null);

  const agente = new AgenteDOC();

  const handleGenerarGuia = (tema: TemaCalor) => {
    setSelectedTema(tema);
    const puntos = agente.desglosarLectura(
      `Guía de nivelación para ${tema.tema} en la materia ${tema.materia}. ` +
      `Fundamento conceptual, resolución paso a paso en micro-bloques y validación final para el trabajo práctico.`
    );

    setGuiaGenerada({
      titulo: `Guía Automática de Nivelación: ${tema.tema}`,
      puntos,
      ejercicio: `Ejercicio puente de 15 minutos: Escribir un caso mínimo de prueba que resuelva la consigna principal sin dependencias complejas.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <span>Pantalla 7</span>
          <span>·</span>
          <span>Panel Docente y Analítica por Materia (Post-MVP)</span>
          <span>·</span>
          <span>IFTS N.° 12</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
          Mapa de Calor de Complejidad Académica
        </h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-3xl">
          Analítica agregada proveniente de las consultas recurrentes a DOC y de las entregas de trabajos prácticos. Permite a los profesores del IFTS 12 detectar qué temas generan mayor fricción y generar guías automáticas de nivelación en 3 puntos clave.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Heatmap Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold font-heading text-slate-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <span>Contenidos con Mayor Fricción en el Cuatrimestre</span>
            </h2>

            <div className="space-y-3">
              {TEMAS_MAPA_CALOR.map((item) => {
                const isSelected = selectedTema.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleGenerarGuia(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[11px] font-mono font-semibold text-slate-500">
                          {item.materia}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mt-0.5 font-heading">
                          {item.tema}
                        </h3>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 ${
                          item.nivelDificultad === 'Alto'
                            ? 'bg-rose-100 text-rose-800'
                            : item.nivelDificultad === 'Medio'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.nivelDificultad}
                      </span>
                    </div>

                    {/* Progress Bar of Heat */}
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.porcentajeDificultad > 70
                            ? 'bg-rose-500'
                            : item.porcentajeDificultad > 50
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.porcentajeDificultad}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.consultasDoc} consultas a DOC</span>
                      <span className="font-mono font-semibold text-slate-700">
                        {item.porcentajeDificultad}% fricción
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Automated Leveling Guide Generated by DOC */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Guía de Nivelación Automática generada por DOC</span>
              </div>
              <h3 className="text-base font-bold font-heading text-slate-900">
                {guiaGenerada ? guiaGenerada.titulo : `Nivelación: ${selectedTema.tema}`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Estructurada bajo el estándar pedagógico de DOC: 3 puntos clave y micro-ejercicio de 15 minutos.
              </p>

              <div className="mt-5 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Desglose Pedagógico en 3 Puntos
                </div>
                {(guiaGenerada
                  ? guiaGenerada.puntos
                  : agente.desglosarLectura(selectedTema.sugerenciaDOC)
                ).map((punto, idx) => (
                  <div key={idx} className="text-xs text-slate-800 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    {punto}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Puente Práctico Sugerido
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  {guiaGenerada
                    ? guiaGenerada.ejercicio
                    : 'Resolver un ejercicio mínimo de 15 minutos que aísle la variable compleja antes de integrar la base de datos.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Formato descargable para el Campus Virtual
              </span>
              <button
                onClick={() => handleGenerarGuia(selectedTema)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerar Guía</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
