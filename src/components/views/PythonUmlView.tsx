import React, { useState } from 'react';
import { Code2, Copy, Check, Play, Database, Cpu, Users, GitBranch, Terminal, ShieldCheck, Sparkles } from 'lucide-react';
import { CODIGO_PYTHON_UML_OFICIAL, RedNeuronalPredictiva, AgenteDOC } from '../../logic/doceCore';

export const PythonUmlView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number>(1);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODIGO_PYTHON_UML_OFICIAL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runLiveSimulation = () => {
    setIsSimulating(true);
    setSimulationLogs([]);

    const steps = [
      '🐍 [Python 3.12 Runtime] Inicializando entorno DOCE...',
      '1. Instanciando Usuario base y Estudiante (Legajo: IFTS12-2024-892, Martín Balbuena)...',
      '2. Configurando PerfilEstudio [Composición]: Trabajo 36 hs/sem, Traslado 2.5 hs/día -> es_vulnerable() = True.',
      '3. Agregando Cursada [Agregación]: SO-102 Sistemas Operativos con ResultadoAcademico (Asistencia: 74%, Atrasos: 2).',
      '4. Invocando RedNeuronalPredictiva (v2.3-IFTS12, F1-Score: 0.89)...',
      '5. PrediccionRiesgo calculada: Probabilidad de deserción 62% [Prioridad Alta: Acompañamiento prioritario no punitivo].',
      '6. Disparando Alerta (id: ALT-9921) para equipo de Tutoría: notificar_tutoria()...',
      '7. AgenteDOC interactúa con el estudiante: desglosar_lectura() -> 3 puntos clave generados (<180 palabras).',
      '8. Tutor (Especialidad: Tutoría Pedagógica) consulta dashboard y ejecuta registrar_intervencion().',
      '✅ Flujo completo de las 11 clases finalizado exitosamente sin excepciones.'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setSimulationLogs((prev) => [...prev, step]);
        if (index === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (index + 1) * 350);
    });
  };

  const clasesUml = [
    {
      id: 1,
      nombre: 'Usuario',
      tipo: 'Superclase Base',
      atributos: 'id_usuario, nombre, email, rol',
      metodos: 'iniciar_sesion(), cerrar_sesion()',
      categoria: 'Herencia',
      desc: 'Clase base abstracta para autenticación y roles en el ecosistema DOCE.',
    },
    {
      id: 2,
      nombre: 'Estudiante',
      tipo: 'Hereda de Usuario',
      atributos: 'legajo, estilo_aprendizaje, cohorte, perfil_estudio, cursadas, predicciones, interacciones_doc',
      metodos: 'completar_onboarding(), consultar_trayectoria(), interactuar_con_doc(mensaje)',
      categoria: 'Herencia',
      desc: 'Núcleo del estudiante. Contiene cursadas y perfil socio-académico.',
    },
    {
      id: 3,
      nombre: 'PerfilEstudio',
      tipo: 'Composición con Estudiante',
      atributos: 'carga_horaria_trabajo, horas_traslado, personas_a_cargo, nivel_estres, preferencia_ritmo',
      metodos: 'actualizar_perfil(), es_vulnerable()',
      categoria: 'Composición',
      desc: 'Evalúa la vulnerabilidad socio-laboral sin estigmatizar.',
    },
    {
      id: 4,
      nombre: 'Cursada',
      tipo: 'Agregación con Estudiante',
      atributos: 'codigo_materia, nombre_materia, anio_lectivo, porcentaje_avance, resultados_academicos',
      metodos: 'obtener_mapa_calor()',
      categoria: 'Agregación',
      desc: 'Materia en curso con resultados académicos y seguimiento de avance.',
    },
    {
      id: 5,
      nombre: 'ResultadoAcademico',
      tipo: 'Composición con Cursada',
      atributos: 'nota_parcial, asistencia_porcentaje, entregas_atrasadas',
      metodos: 'calcular_promedio()',
      categoria: 'Composición',
      desc: 'Métricas de rendimiento y regularidad por materia.',
    },
    {
      id: 6,
      nombre: 'RedNeuronalPredictiva',
      tipo: 'Módulo IA',
      atributos: 'version_modelo, f1_score (0.89)',
      metodos: 'evaluar_riesgo(vector_estudiante)',
      categoria: 'IA',
      desc: 'Modelo de Machine Learning para detección temprana de deserción.',
    },
    {
      id: 7,
      nombre: 'PrediccionRiesgo',
      tipo: 'Entidad de Clasificación',
      atributos: 'id_prediccion, probabilidad_desercion, nivel_riesgo, fecha_calculo',
      metodos: 'clasificar_riesgo()',
      categoria: 'IA',
      desc: 'Resultado estructurado del modelo con orientación no punitiva.',
    },
    {
      id: 8,
      nombre: 'Alerta',
      tipo: 'Entidad de Notificación',
      atributos: 'id_alerta, estado, fecha_generacion, estudiante_anonimo_id',
      metodos: 'notificar_tutoria(), marcar_atendida()',
      categoria: 'Institucional',
      desc: 'Alerta temprana anónima para el equipo pedagógico.',
    },
    {
      id: 9,
      nombre: 'AgenteDOC',
      tipo: 'Módulo IA Generativo',
      atributos: 'system_prompt, limite_palabras (180), modo',
      metodos: 'desglosar_lectura(texto), generar_mensaje_motivacional(), activar_fallback()',
      categoria: 'IA',
      desc: 'Compañero pedagógico: desglose en 3 puntos y <180 palabras.',
    },
    {
      id: 10,
      nombre: 'InteraccionDOC',
      tipo: 'Entidad de Bitácora',
      atributos: 'id_interaccion, mensaje_usuario, respuesta_doc, fecha_hora',
      metodos: 'registrar_interaccion()',
      categoria: 'Pedagogía',
      desc: 'Registro estructurado de diálogos y retroalimentación.',
    },
    {
      id: 11,
      nombre: 'Tutor',
      tipo: 'Hereda de Usuario',
      atributos: 'especialidad, intervenciones_realizadas',
      metodos: 'consultar_dashboard_alertas(), registrar_intervencion(id_alerta)',
      categoria: 'Herencia',
      desc: 'Docente orientador del IFTS 12 que interviene ante alertas.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <span>Arquitectura Oficial</span>
          <span>·</span>
          <span>11 Clases UML (diagrama-clase-doce)</span>
          <span>·</span>
          <span>Python 3.12 POO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
          Arquitectura Orientada a Objetos en Python
        </h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-3xl">
          Implementación oficial del Grupo 6 para el IFTS N.° 12 con tipado estricto (`typing`), encapsulamiento, buenas prácticas de desarrollo y el enfoque no punitivo de alerta temprana.
        </p>
      </div>

      {/* 11 Classes UML Grid & Detail Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold font-heading text-slate-900">
              Las 11 Clases del Modelo UML Oficial
            </h2>
            <p className="text-xs text-slate-500">
              Herencia, composición, agregación y módulos predictivos de IA.
            </p>
          </div>
          <button
            onClick={runLiveSimulation}
            disabled={isSimulating}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isSimulating ? 'Simulando ejecución...' : 'Ejecutar Simulación POO'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {clasesUml.map((c) => {
            const isSelected = selectedClassId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    #{c.id}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {c.categoria}
                  </span>
                </div>
                <div className="font-bold text-xs font-mono mt-1 text-slate-900 truncate">
                  class {c.nombre}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {c.tipo}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Class Specification Card */}
        {(() => {
          const sel = clasesUml.find((c) => c.id === selectedClassId) || clasesUml[0];
          return (
            <div className="mt-5 p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Clase {sel.id} de 11
                  </span>
                  <h3 className="text-base font-bold font-mono text-slate-900">
                    class {sel.nombre}
                  </h3>
                  <span className="text-xs text-slate-500">({sel.tipo})</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-3">{sel.desc}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold mb-1">
                    Atributos
                  </span>
                  <span className="text-slate-800">{sel.atributos}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold mb-1">
                    Métodos Oficiales
                  </span>
                  <span className="text-emerald-800 font-semibold">{sel.metodos}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Terminal Live Simulation Output */}
      {simulationLogs.length > 0 && (
        <div className="p-5 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-mono text-xs shadow-lg space-y-1.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Simulación Interactiva en Vivo: Interacción de las 11 Clases</span>
            </span>
            <span className="text-[10px] text-emerald-400">STATUS: OK</span>
          </div>
          <div className="pt-2 space-y-1">
            {simulationLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Python Code Viewer */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              doce_modelo_uml_11_clases.py
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · Python 3.12 (typing, dataclasses, POO)
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">
          <pre>
            <code>{CODIGO_PYTHON_UML_OFICIAL}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
