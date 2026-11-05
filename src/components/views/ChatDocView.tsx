import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BookOpen, Clock, ShieldAlert, Code2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AgenteDOC } from '../../logic/doceCore';
import { ASSETS } from '../../data/assets';

interface Message {
  id: string;
  sender: 'user' | 'doc';
  text: string;
  timestamp: string;
  wordCount?: number;
  isFallback?: boolean;
  puntosClave?: string[];
}

interface ChatDocViewProps {
  initialPrompt?: string;
  onStart15MinPomodoro?: () => void;
  onNavigateToUml?: () => void;
  onNavigateToMockups?: () => void;
}

export const ChatDocView: React.FC<ChatDocViewProps> = ({
  initialPrompt = '',
  onStart15MinPomodoro,
  onNavigateToUml,
  onNavigateToMockups,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'doc',
      text: '¡Hola! Soy DOC, tu compañero digital de estudio del IFTS N.° 12. Reconozco todo el esfuerzo que le ponés a tu cursada compatibilizando estudio, trabajo y vida cotidiana. ¿En qué te puedo acompañar hoy? Podemos desglosar un texto en 3 puntos clave o armar un bloque ágil de 15 minutos.',
      timestamp: '09:00',
      wordCount: 52,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [simulateOffline, setSimulateOffline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agente = useRef(new AgenteDOC());

  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Pedagogical evaluation & response generation
    setTimeout(async () => {
      let replyText = '';
      let isFallback = false;
      let puntosClave: string[] | undefined = undefined;

      const lower = textToSend.toLowerCase();

      // Fallback check or simulated offline contingency
      if (simulateOffline) {
        const fb = agente.current.activarFallback('Contenido solicitado');
        replyText = `${fb.nota}\n\n${fb.puntos.join('\n')}`;
        puntosClave = fb.puntos;
        isFallback = true;
      } else if (lower.includes('desglosar') || lower.includes('resumir') || lower.includes('texto') || lower.includes('apunte') || textToSend.length > 250) {
        // Regla: Si pide ayuda con un texto, desglosarlo en EXACTAMENTE 3 PUNTOS CLAVE
        const puntos = agente.current.desglosarLectura(textToSend);
        replyText = `¡Excelente iniciativa repasar este material! Reconozco tu dedicación. Lo desglosé en exactamente 3 puntos clave para que lo encaremos paso a paso:\n\n${puntos.join('\n')}\n\n¿Le dedicamos un bloque de 15 minutos a resolver el punto 1?`;
        puntosClave = puntos;
      } else if (lower.includes('desánimo') || lower.includes('desanimo') || lower.includes('atrasado') || lower.includes('cansado') || lower.includes('no llego') || lower.includes('bloqueo')) {
        // Regla: Si detectas desánimo o atraso, usar apoyo positivo: "¡Venís trabajando duro! ¿Hacemos esta actividad juntos en 15 minutos?"
        replyText = `¡Venís trabajando duro! Reconozco el peso de la rutina laboral y el viaje diario al IFTS 12. Nadie te va a sancionar acá. ¿Hacemos esta actividad juntos en 15 minutos? Un micro-paso enfocado hoy te va a devolver la tranquilidad. Estoy acá para acompañarte.`;
      } else if (lower.includes('python') || lower.includes('uml') || lower.includes('clases') || lower.includes('código') || lower.includes('codigo') || lower.includes('poo')) {
        // Regla Desarrollador: Explicar las 11 clases UML
        replyText = `La arquitectura oficial de DOCE se compone de 11 clases en Python 3.12 con tipado estricto: Usuario (superclase), Estudiante y Tutor (herencia), PerfilEstudio (composición), Cursada (agregación con Estudiante), ResultadoAcademico, RedNeuronalPredictiva (F1=0.89), PrediccionRiesgo, Alerta, AgenteDOC e InteraccionDOC. Podés consultar el código completo en la pestaña "UML & Python".`;
      } else if (lower.includes('campaña') || lower.includes('mockup') || lower.includes('pantalla') || lower.includes('institucional') || lower.includes('medios')) {
        // Regla Medios: Explicar las 7 pantallas y el lema
        replyText = `DOCE se despliega bajo el lema: “Un compañero para estudiar y una herramienta para acompañar”. Articula 7 pantallas: 1) Tablero de Corcho, 2) Chat DOC, 3) Onboarding amigable, 4) Pomodoro adaptativo, 5) Motivación e insignias, 6) Dashboard institucional anónimo de alerta temprana, y 7) Panel docente de mapas de calor. Así se protege la permanencia sin estigmatizar al estudiante.`;
      } else {
        // Respuesta general cálida y pedagógica
        replyText = `¡Hola! Reconozco tu constancia en la Tecnicatura del IFTS 12. Cada pregunta es una oportunidad para afianzar conceptos. ¿Querés que desglosemos un tema en 3 puntos clave o preferís que programemos un bloque Pomodoro de 15 minutos para avanzar sin estrés?`;
      }

      const wordCount = AgenteDOC.contarPalabras(replyText);

      const docMsg: Message = {
        id: `doc-${Date.now()}`,
        sender: 'doc',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        wordCount,
        isFallback,
        puntosClave,
      };

      setMessages((prev) => [...prev, docMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left / Top Info: Identity & System Prompt Rules */}
      <div className="lg:col-span-4 space-y-4">
        {/* Companion Avatar Card */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-emerald-50">
            <img
              src={ASSETS.docMascot}
              alt="Mascota DOC"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold font-heading text-slate-900">DOC</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Núcleo Inteligente
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Grupo 6 · IFTS N.° 12</p>
            <div className="text-[11px] text-slate-600 mt-1 italic">
              “Un compañero para estudiar, herramienta para acompañar”
            </div>
          </div>
        </div>

        {/* Operational Constraints & Pedagogy Card */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Principios Pedagógicos de DOC</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Reconocer el esfuerzo:</strong> Saluda valorando el tiempo del estudiante.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Desglose en 3 puntos:</strong> Todo texto complejo se sintetiza en exactamente 3 claves.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Límite estricto:</strong> Respuestas breves y digeribles en <strong>&lt; 180 palabras</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>No punitivo:</strong> Nunca diagnostica ni sanciona; apoya con bloques de 15 min.</span>
            </li>
          </ul>

          {/* Fallback Simulation Mode Toggle */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs">
              <div className="font-semibold text-slate-700">Modo Contingencia / Fallback</div>
              <div className="text-[11px] text-slate-500">Simula fallo de API y entrega plantilla en caché</div>
            </div>
            <button
              onClick={() => setSimulateOffline(!simulateOffline)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                simulateOffline
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {simulateOffline ? 'Fallback Activo' : 'Online'}
            </button>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Atajos de Consulta Rápida
          </div>
          <div className="space-y-1.5">
            <button
              onClick={() => handleSend("Me siento con desánimo y atrasado con las entregas de la cursada.")}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs transition-colors border border-slate-100"
            >
              😔 "Siento desánimo y atraso con las entregas"
            </button>
            <button
              onClick={() => handleSend("Ayúdame a desglosar este tema complejo de Sistemas Operativos: La paginación de memoria virtual divide el espacio en marcos físicos y páginas lógicas, mapeadas por una tabla de páginas.")}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs transition-colors border border-slate-100"
            >
              📖 "Desglosar texto académico en 3 puntos"
            </button>
            <button
              onClick={() => handleSend("Explicame la arquitectura orientada a objetos en Python de las 11 clases del modelo UML.")}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs transition-colors border border-slate-100"
            >
              💻 "¿Cómo están estructuradas las 11 clases en Python?"
            </button>
            <button
              onClick={() => handleSend("¿Cómo se articula la campaña de Medios con los 7 mockups y la alerta temprana?")}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs transition-colors border border-slate-100"
            >
              📢 "Marco comunicacional y 7 mockups"
            </button>
          </div>
        </div>
      </div>

      {/* Right / Chat Stream Card */}
      <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs h-[640px]">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              DOC
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Canal de Acompañamiento Activo</span>
                <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Respuestas &lt; 180 palabras
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Atención pedagógica directa · Grupo 6 IFTS 12
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onStart15MinPomodoro && (
              <button
                onClick={onStart15MinPomodoro}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
                title="Comenzar sesión de estudio de 15 min"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Bloque 15 min</span>
              </button>
            )}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-emerald-50/90 text-slate-900 border border-emerald-200 rounded-tl-xs shadow-xs'
                }`}
              >
                {msg.sender === 'doc' && (
                  <div className="flex items-center justify-between gap-3 text-[11px] text-emerald-800 font-semibold mb-2 pb-1 border-b border-emerald-200/60">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      DOC
                    </span>
                    <span className="font-mono text-slate-500">
                      {msg.wordCount !== undefined ? `${msg.wordCount} palabras (<180)` : ''}
                    </span>
                  </div>
                )}

                {msg.isFallback && (
                  <div className="mb-2 p-2 bg-amber-100/80 border border-amber-300 rounded text-amber-900 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Respuesta servida desde memoria segura en caché (Modo Fallback).</span>
                  </div>
                )}

                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.sender === 'doc' && msg.text.includes('15 minutos') && (
                  <div className="mt-3 pt-2 border-t border-emerald-200/50 flex flex-wrap gap-2">
                    {onStart15MinPomodoro && (
                      <button
                        onClick={onStart15MinPomodoro}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        <span>¡Dale, arranquemos 15 min!</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl w-32 text-xs text-emerald-800 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>DOC escribiendo...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribí tu consulta, texto para desglosar o cómo te sentís hoy..."
              className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl shadow-sm transition-colors"
              aria-label="Enviar mensaje a DOC"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>DOC responde en menos de 180 palabras y desglosa en 3 puntos.</span>
            <span>Acompañamiento no punitivo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
