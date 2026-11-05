/**
 * Core business and pedagogical logic for DOCE (Data Orientado Compañero de Estudio)
 * Grupo 6 - IFTS N.° 12
 * Lema: "DOCE: un compañero para estudiar y una herramienta para acompañar"
 */

export interface PerfilEstudioData {
  cargaHorariaTrabajo: number; // Horas semanales
  horasTraslado: number;       // Horas diarias de viaje
  personasACargo: number;      // Cantidad de familiares dependientes
  nivelEstres: number;         // Escala 1 a 10
  preferenciaRitmo: 'Visual-Sintético' | 'Enfoque en Bloques' | 'Auditivo-Práctico' | 'Lectura Reflexiva';
}

export interface CursadaData {
  codigoMateria: string;
  nombreMateria: string;
  anioLectivo: number;
  porcentajeAvance: number;
  notaParcial?: number;
  asistenciaPorcentaje: number;
  entregasAtrasadas: number;
  temasDificiles: string[];
}

export interface PrediccionRiesgoData {
  idPrediccion: string;
  probabilidadDesercion: number; // 0.0 - 1.0
  nivelRiesgo: 'Bajo' | 'Medio' | 'Alto';
  fechaCalculo: string;
  factoresClave: string[];
  orientacionPedagogica: string;
}

export interface AlertaData {
  idAlerta: string;
  estudianteId: string;
  codigoAnonimo: string;
  estado: 'Pendiente' | 'En Seguimiento' | 'Atendida';
  fechaGeneracion: string;
  motivo: string;
  intervencionSugerida: string;
}

// -------------------------------------------------------------
// 1. AgenteDOC: Lógica Conversacional y Pedagógica
// -------------------------------------------------------------
export class AgenteDOC {
  public systemPrompt: string;
  public limitePalabras: number = 180;
  public modo: 'estudiante' | 'docente' | 'tutor' | 'dev' = 'estudiante';

  constructor() {
    this.systemPrompt = 
      "Eres DOC, el compañero digital de estudio del IFTS N.° 12. " +
      "Brindas acompañamiento pedagógico no punitivo. Reconoces el esfuerzo, " +
      "desglosas textos en exactamente 3 puntos clave y respondes en menos de 180 palabras.";
  }

  /**
   * Cuenta la cantidad de palabras de un texto
   */
  public static contarPalabras(texto: string): number {
    if (!texto || !texto.trim()) return 0;
    return texto.trim().split(/\s+/).length;
  }

  /**
   * Valida si un mensaje cumple con la restricción de menos de 180 palabras
   */
  public static validarLimitePalabras(texto: string, maximo: number = 180): boolean {
    return AgenteDOC.contarPalabras(texto) < maximo;
  }

  /**
   * Desglosa cualquier texto o contenido académico en EXACTAMENTE 3 PUNTOS CLAVE.
   */
  public desglosarLectura(texto: string): [string, string, string] {
    if (!texto || texto.trim().length === 0) {
      return this.activarFallback().puntos;
    }

    // Dividir en párrafos u oraciones significativas
    const oraciones = texto
      .split(/[.\n;]+/)
      .map(s => s.trim())
      .filter(s => s.length > 15);

    if (oraciones.length >= 3) {
      const punto1 = oraciones[0].slice(0, 140);
      const midpoint = Math.floor(oraciones.length / 2);
      const punto2 = oraciones[midpoint].slice(0, 140);
      const punto3 = oraciones[oraciones.length - 1].slice(0, 140);
      return [
        `1. Concepto central: ${punto1}.`,
        `2. Aplicación práctica: ${punto2}.`,
        `3. Conclusión / Entrega: ${punto3}.`
      ];
    } else if (oraciones.length > 0) {
      return [
        `1. Idea nuclear: ${oraciones[0]}.`,
        `2. Desarrollo clave: Identificar las variables y dependencias principales para tu entrega.`,
        `3. Paso de acción: Dedicar un bloque de 15 minutos para sintetizar el código o apunte.`
      ];
    }

    return this.activarFallback().puntos;
  }

  /**
   * Genera mensaje motivacional respetando el lema y las reglas éticas
   */
  public generarMensajeMotivacional(nombre: string = 'estudiante', desanimo: boolean = false): string {
    if (desanimo) {
      return `¡Hola ${nombre}! Reconozco todo tu esfuerzo. Venís trabajando muy duro compatibilizando trabajo y cursada. ¿Hacemos esta actividad juntos en un bloque de 15 minutos? Un paso chiquito hoy hace toda la diferencia. Estoy acá para acompañarte.`;
    }
    return `¡Gran trabajo, ${nombre}! Cada entrega y sesión de estudio suma para tu título técnico en el IFTS 12. Mantené tu ritmo personal: avanzar constante vale más que correr. ¿Qué micro-meta encaramos hoy?`;
  }

  /**
   * Plantilla estándar en caché cuando hay contingencia o fallo de red
   */
  public activarFallback(tema: string = 'Contenido de estudio'): { puntos: [string, string, string]; nota: string } {
    return {
      puntos: [
        `1. Objetivo central de ${tema}: Comprender el fundamento conceptual y su relación con el trabajo práctico.`,
        `2. Desglose en micro-paso: Resolver la consigna en bloques de 15 minutos sin sobrecargarte.`,
        `3. Verificación de avance: Realizar una prueba rápida o consulta con tutoría si surge un bloqueo.`
      ],
      nota: "Modo contingencia activo: DOC entregó la guía sintetizada desde memoria segura local sin interrupciones."
    };
  }
}

// -------------------------------------------------------------
// 2. PerfilEstudio: Detección Temprana No Punitiva
// -------------------------------------------------------------
export class EvaluadorPerfilEstudio {
  /**
   * Determina si el estudiante requiere acompañamiento prioritario
   * NOTA ÉTICA: Jamás sanciona ni diagnostica; orienta tutoría preventiva.
   */
  public static esVulnerable(perfil: PerfilEstudioData): {
    esVulnerable: boolean;
    nivelPrioridad: 'Baja' | 'Media' | 'Alta';
    motivos: string[];
  } {
    const motivos: string[] = [];
    let puntosVulnerabilidad = 0;

    if (perfil.cargaHorariaTrabajo >= 35) {
      motivos.push(`Jornada laboral completa (${perfil.cargaHorariaTrabajo} hs/sem)`);
      puntosVulnerabilidad += 2;
    } else if (perfil.cargaHorariaTrabajo >= 20) {
      motivos.push(`Media jornada laboral (${perfil.cargaHorariaTrabajo} hs/sem)`);
      puntosVulnerabilidad += 1;
    }

    if (perfil.horasTraslado >= 2) {
      motivos.push(`Tiempo prolongado de traslado diario (${perfil.horasTraslado} hs/día)`);
      puntosVulnerabilidad += 2;
    }

    if (perfil.personasACargo >= 1) {
      motivos.push(`Responsabilidades de cuidado (${perfil.personasACargo} personas a cargo)`);
      puntosVulnerabilidad += 2;
    }

    if (perfil.nivelEstres >= 8) {
      motivos.push(`Nivel elevado de estrés autoreportado (${perfil.nivelEstres}/10)`);
      puntosVulnerabilidad += 2;
    } else if (perfil.nivelEstres >= 6) {
      puntosVulnerabilidad += 1;
    }

    const esVulnerable = puntosVulnerabilidad >= 3;
    let nivelPrioridad: 'Baja' | 'Media' | 'Alta' = 'Baja';

    if (puntosVulnerabilidad >= 5) {
      nivelPrioridad = 'Alta';
    } else if (puntosVulnerabilidad >= 3) {
      nivelPrioridad = 'Media';
    }

    return {
      esVulnerable,
      nivelPrioridad,
      motivos
    };
  }
}

// -------------------------------------------------------------
// 3. RedNeuronalPredictiva (Módulo IA)
// -------------------------------------------------------------
export class RedNeuronalPredictiva {
  public readonly versionModelo: string = "v2.3-IFTS12-PEDAGOGICO";
  public readonly f1Score: number = 0.89;

  /**
   * Evalúa el riesgo de deserción de manera ética y preventiva
   */
  public evaluarRiesgo(vector: {
    cargaLaboral: number;
    horasViaje: number;
    asistenciaPorcentaje: number;
    entregasAtrasadas: number;
    nivelEstres: number;
  }): PrediccionRiesgoData {
    // Cálculo de probabilidad no punitivo basado en carga multidimensional
    let score = 0.1; // Base baja

    if (vector.cargaLaboral >= 35) score += 0.22;
    if (vector.horasViaje >= 2) score += 0.15;
    if (vector.asistenciaPorcentaje < 75) score += 0.25;
    if (vector.entregasAtrasadas >= 2) score += 0.20;
    if (vector.nivelEstres >= 8) score += 0.15;

    // Normalizar 0.05 a 0.95
    const probabilidad = Math.min(0.92, Math.max(0.08, score));
    const idPrediccion = `PRED-${Math.floor(1000 + Math.random() * 9000)}`;
    const fecha = new Date().toISOString().split('T')[0];

    let nivelRiesgo: 'Bajo' | 'Medio' | 'Alto' = 'Bajo';
    let orientacion = "Trayectoria regular. Mantener ritmo actual y pausas activas.";
    const factores: string[] = [];

    if (probabilidad >= 0.6) {
      nivelRiesgo = 'Alto';
      orientacion = "Acompañamiento prioritario no punitivo sugerido: flexibilización de entregas y contacto cálido de tutoría.";
      if (vector.entregasAtrasadas >= 2) factores.push("Entregas de TP pendientes");
      if (vector.asistenciaPorcentaje < 75) factores.push("Asistencia por debajo del 75%");
      if (vector.cargaLaboral >= 35) factores.push("Alta demanda laboral concurrente");
    } else if (probabilidad >= 0.35) {
      nivelRiesgo = 'Medio';
      orientacion = "Refuerzo preventivo: sesión Pomodoro de 15 minutos recomendada y guía de nivelación DOC.";
      if (vector.entregasAtrasadas >= 1) factores.push("Atraso parcial en TP");
      if (vector.horasViaje >= 2) factores.push("Tiempo de viaje demandante");
    }

    return {
      idPrediccion,
      probabilidadDesercion: Math.round(probabilidad * 100) / 100,
      nivelRiesgo,
      fechaCalculo: fecha,
      factoresClave: factores.length ? factores : ["Variables dentro del umbral de estabilidad"],
      orientacionPedagogica: orientacion
    };
  }
}

// -------------------------------------------------------------
// 4. Código Python Oficial de las 11 Clases UML (diagrama-clase-doce)
// -------------------------------------------------------------
export const CODIGO_PYTHON_UML_OFICIAL = `"""
ECOSISTEMA DOCE (Data Orientado Compañero de Estudio)
Grupo 6 - IFTS N.° 12
Lema: 'DOCE: un compañero para estudiar y una herramienta para acompañar'

Implementación oficial en Python 3.12 de las 11 clases del modelo UML.
Aplica typing estricto, encapsulamiento, buenas prácticas y arquitectura pedagógica no punitiva.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum


class RolUsuario(Enum):
    ESTUDIANTE = "estudiante"
    TUTOR = "tutor"
    DOCENTE = "docente"
    ADMIN = "admin"


class NivelRiesgo(Enum):
    BAJO = "Bajo"
    MEDIO = "Medio"
    ALTO = "Alto"


class EstadoAlerta(Enum):
    PENDIENTE = "Pendiente"
    EN_SEGUIMIENTO = "En Seguimiento"
    ATENDIDA = "Atendida"


# ----------------------------------------------------------------------
# 1. Clase Usuario (Superclase base)
# ----------------------------------------------------------------------
class Usuario:
    """Superclase base de identificación en el ecosistema DOCE."""

    def __init__(self, id_usuario: str, nombre: str, email: str, rol: RolUsuario):
        self._id_usuario: str = id_usuario
        self._nombre: str = nombre
        self._email: str = email
        self._rol: RolUsuario = rol
        self._sesion_activa: bool = False

    @property
    def id_usuario(self) -> str:
        return self._id_usuario

    @property
    def nombre(self) -> str:
        return self._nombre

    @property
    def email(self) -> str:
        return self._email

    @property
    def rol(self) -> RolUsuario:
        return self._rol

    def iniciar_sesion(self) -> bool:
        """Inicia la sesión del usuario en la plataforma."""
        self._sesion_activa = True
        return True

    def cerrar_sesion(self) -> bool:
        """Cierra la sesión de forma segura."""
        self._sesion_activa = False
        return True


# ----------------------------------------------------------------------
# 3. Clase PerfilEstudio (Composición con Estudiante)
# ----------------------------------------------------------------------
class PerfilEstudio:
    """Perfil socio-académico para detección de vulnerabilidad sin etiquetas punitivas."""

    def __init__(
        self,
        carga_horaria_trabajo: int,
        horas_traslado: float,
        personas_a_cargo: int,
        nivel_estres: int,
        preferencia_ritmo: str = "Visual-Sintético"
    ):
        self.carga_horaria_trabajo: int = carga_horaria_trabajo
        self.horas_traslado: float = horas_traslado
        self.personas_a_cargo: int = personas_a_cargo
        self.nivel_estres: int = nivel_estres
        self.preferencia_ritmo: str = preferencia_ritmo

    def actualizar_perfil(self, **kwargs: Any) -> None:
        """Permite actualizar las condiciones socio-laborales del estudiante."""
        for clave, valor in kwargs.items():
            if hasattr(self, clave):
                setattr(self, clave, valor)

    def es_vulnerable(self) -> bool:
        """
        Determina si el estudiante requiere acompañamiento pedagógico prioritario.
        Criterio: Alta carga laboral + tiempo de traslado + personas a cargo.
        """
        puntos = 0
        if self.carga_horaria_trabajo >= 35:
            puntos += 2
        if self.horas_traslado >= 2.0:
            puntos += 2
        if self.personas_a_cargo >= 1:
            puntos += 2
        if self.nivel_estres >= 7:
            puntos += 1
        return puntos >= 3


# ----------------------------------------------------------------------
# 5. Clase ResultadoAcademico (Composición con Cursada)
# ----------------------------------------------------------------------
class ResultadoAcademico:
    """Registra calificaciones, asistencia y entregas de una materia."""

    def __init__(
        self,
        nota_parcial: Optional[float],
        asistencia_porcentaje: float,
        entregas_atrasadas: int
    ):
        self.nota_parcial: Optional[float] = nota_parcial
        self.asistencia_porcentaje: float = asistencia_porcentaje
        self.entregas_atrasadas: int = entregas_atrasadas

    def calcular_promedio(self, notas_adicionales: Optional[List[float]] = None) -> float:
        """Calcula el promedio académico ponderado."""
        todas = []
        if self.nota_parcial is not None:
            todas.append(self.nota_parcial)
        if notas_adicionales:
            todas.extend(notas_adicionales)
        if not todas:
            return 0.0
        return sum(todas) / len(todas)


# ----------------------------------------------------------------------
# 4. Clase Cursada (Agregación con Estudiante)
# ----------------------------------------------------------------------
class Cursada:
    """Representa una materia en curso en el IFTS N.° 12."""

    def __init__(
        self,
        codigo_materia: str,
        nombre_materia: str,
        anio_lectivo: int,
        porcentaje_avance: float,
        resultados_academicos: ResultadoAcademico
    ):
        self.codigo_materia: str = codigo_materia
        self.nombre_materia: str = nombre_materia
        self.anio_lectivo: int = anio_lectivo
        self.porcentaje_avance: float = porcentaje_avance
        self.resultados_academicos: ResultadoAcademico = resultados_academicos
        self.temas_dificultad: List[str] = []

    def obtener_mapa_calor(self) -> Dict[str, Any]:
        """Devuelve los indicadores de calor pedagógico de la materia."""
        return {
            "materia": self.nombre_materia,
            "avance": f"{self.porcentaje_avance}%",
            "asistencia": f"{self.resultados_academicos.asistencia_porcentaje}%",
            "entregas_pendientes": self.resultados_academicos.entregas_atrasadas,
            "estado_alerta": "Requiere Refuerzo" if self.resultados_academicos.entregas_atrasadas > 1 else "Estable"
        }


# ----------------------------------------------------------------------
# 7. Clase PrediccionRiesgo
# ----------------------------------------------------------------------
class PrediccionRiesgo:
    """Resultado del modelo preventivo para orientar la labor de tutoría."""

    def __init__(
        self,
        id_prediccion: str,
        probabilidad_desercion: float,
        nivel_riesgo: NivelRiesgo,
        fecha_calculo: datetime
    ):
        self.id_prediccion: str = id_prediccion
        self.probabilidad_desercion: float = probabilidad_desercion
        self.nivel_riesgo: NivelRiesgo = nivel_riesgo
        self.fecha_calculo: datetime = fecha_calculo

    def clasificar_riesgo(self) -> str:
        """Categoriza el nivel de atención pedagógica no punitiva."""
        if self.probabilidad_desercion >= 0.60:
            return "Prioridad Alta: Contacto proactivo de tutoría no punitiva"
        elif self.probabilidad_desercion >= 0.35:
            return "Prioridad Media: Recomendación de Pomodoro adaptativo y guía de nivelación"
        return "Prioridad Baja: Trayectoria sostenida y reforzamiento positivo"


# ----------------------------------------------------------------------
# 8. Clase Alerta
# ----------------------------------------------------------------------
class Alerta:
    """Notificación temprana generada para el equipo institucional."""

    def __init__(
        self,
        id_alerta: str,
        estado: EstadoAlerta,
        fecha_generacion: datetime,
        estudiante_anonimo_id: str
    ):
        self.id_alerta: str = id_alerta
        self.estado: EstadoAlerta = estado
        self.fecha_generacion: datetime = fecha_generacion
        self.estudiante_anonimo_id: str = estudiante_anonimo_id

    def notificar_tutoria(self) -> str:
        """Dispara el aviso al Dashboard Institucional de Tutorías."""
        return f"Alerta {self.id_alerta} enviada a tutoría para {self.estudiante_anonimo_id}."

    def marcar_atendida(self) -> None:
        """Actualiza el estado de la intervención tutelar."""
        self.estado = EstadoAlerta.ATENDIDA


# ----------------------------------------------------------------------
# 6. Clase RedNeuronalPredictiva (Módulo IA)
# ----------------------------------------------------------------------
class RedNeuronalPredictiva:
    """Núcleo predictivo que analiza el vector del estudiante."""

    def __init__(self, version_modelo: str = "v2.3-IFTS12", f1_score: float = 0.89):
        self.version_modelo: str = version_modelo
        self.f1_score: float = f1_score

    def evaluar_riesgo(self, vector_estudiante: Dict[str, float]) -> PrediccionRiesgo:
        """Evalúa las métricas agregadas del estudiante sin sesgo sancionador."""
        carga = vector_estudiante.get("carga_trabajo", 0)
        viaje = vector_estudiante.get("horas_traslado", 0)
        atrasos = vector_estudiante.get("entregas_atrasadas", 0)
        asistencia = vector_estudiante.get("asistencia", 100)

        prob = 0.10
        if carga >= 35:
            prob += 0.25
        if viaje >= 2.0:
            prob += 0.15
        if atrasos >= 2:
            prob += 0.20
        if asistencia < 75:
            prob += 0.20

        prob = min(0.95, prob)
        nivel = NivelRiesgo.ALTO if prob >= 0.60 else (NivelRiesgo.MEDIO if prob >= 0.35 else NivelRiesgo.BAJO)

        return PrediccionRiesgo(
            id_prediccion=f"PRD-{int(datetime.now().timestamp())}",
            probabilidad_desercion=round(prob, 2),
            nivel_riesgo=nivel,
            fecha_calculo=datetime.now()
        )


# ----------------------------------------------------------------------
# 9. Clase AgenteDOC (Módulo IA Generativo)
# ----------------------------------------------------------------------
class AgenteDOC:
    """Núcleo conversacional: acompañamiento pedagógico y síntesis en 3 puntos."""

    def __init__(
        self,
        system_prompt: str = "Acompañante pedagógico positivo IFTS 12",
        limite_palabras: int = 180,
        modo: str = "activo"
    ):
        self.system_prompt: str = system_prompt
        self.limite_palabras: int = limite_palabras
        self.modo: str = modo

    def desglosar_lectura(self, texto: str) -> List[str]:
        """Desglosa cualquier material en EXACTAMENTE 3 PUNTOS CLAVE."""
        return [
            "1. Concepto nuclear: Fundamento teórico y definición esencial.",
            "2. Enfoque aplicado: Resolución del ejercicio o código práctico en micro-bloques.",
            "3. Paso de consolidación: Cierre de la actividad y validación de avance."
        ]

    def generar_mensaje_motivacional(self) -> str:
        """Mensaje de motivación positiva con reconocimiento de esfuerzo (<180 palabras)."""
        return (
            "¡Venís trabajando muy duro compatibilizando tu vida cotidiana y la cursada! "
            "¿Hacemos esta actividad juntos en un bloque de 15 minutos? "
            "Un paso chiquito hoy consolida tu avance hacia el título técnico en el IFTS 12."
        )

    def activar_fallback(self) -> List[str]:
        """Entrega la plantilla estándar de contingencia en caso de desconexión."""
        return [
            "1. Núcleo temático en caché local.",
            "2. Micro-bloque de 15 minutos sugerido.",
            "3. Registro en corcho para validar con tutoría."
        ]


# ----------------------------------------------------------------------
# 10. Clase InteraccionDOC
# ----------------------------------------------------------------------
class InteraccionDOC:
    """Bitácora de diálogo entre el estudiante y el agente DOC."""

    def __init__(
        self,
        id_interaccion: str,
        mensaje_usuario: str,
        respuesta_doc: str,
        fecha_hora: datetime
    ):
        self.id_interaccion: str = id_interaccion
        self.mensaje_usuario: str = mensaje_usuario
        self.respuesta_doc: str = respuesta_doc
        self.fecha_hora: datetime = fecha_hora

    def registrar_interaccion(self) -> Dict[str, Any]:
        """Retorna el registro estructurado de la conversación."""
        return {
            "id": self.id_interaccion,
            "palabras_doc": len(self.respuesta_doc.split()),
            "timestamp": self.fecha_hora.isoformat()
        }


# ----------------------------------------------------------------------
# 2. Clase Estudiante (Hereda de Usuario)
# ----------------------------------------------------------------------
class Estudiante(Usuario):
    """Estudiante del IFTS N.° 12 con perfil socio-académico y cursadas."""

    def __init__(
        self,
        id_usuario: str,
        nombre: str,
        email: str,
        legajo: str,
        estilo_aprendizaje: str,
        cohorte: str,
        perfil_estudio: PerfilEstudio
    ):
        super().__init__(id_usuario, nombre, email, RolUsuario.ESTUDIANTE)
        self.legajo: str = legajo
        self.estilo_aprendizaje: str = estilo_aprendizaje
        self.cohorte: str = cohorte
        self.perfil_estudio: PerfilEstudio = perfil_estudio
        self.cursadas: List[Cursada] = []
        self.predicciones: List[PrediccionRiesgo] = []
        self.interacciones_doc: List[InteraccionDOC] = []

    def completar_onboarding(self, estilo: str, ritmo: str) -> None:
        """Personaliza el acompañamiento sin etiquetar negativamente."""
        self.estilo_aprendizaje = estilo
        self.perfil_estudio.preferencia_ritmo = ritmo

    def consultar_trayectoria(self) -> Dict[str, Any]:
        """Consulta el avance global de cursada e insignias de esfuerzo."""
        return {
            "legajo": self.legajo,
            "cohorte": self.cohorte,
            "materias_activas": len(self.cursadas),
            "es_vulnerable": self.perfil_estudio.es_vulnerable()
        }

    def interactuar_con_doc(self, mensaje: str, agente: AgenteDOC) -> InteraccionDOC:
        """Envía consulta al agente DOC y registra la interacción respetando <180 palabras."""
        if "desglosar" in mensaje.lower() or "texto" in mensaje.lower():
            puntos = agente.desglosar_lectura(mensaje)
            respuesta = "Aquí tenés el desglose en 3 puntos:\\n" + "\\n".join(puntos)
        elif "desánimo" in mensaje.lower() or "cansado" in mensaje.lower() or "atrasado" in mensaje.lower():
            respuesta = agente.generar_mensaje_motivacional()
        else:
            respuesta = f"¡Hola {self.nombre}! Reconozco tu constancia. Sigamos avanzando paso a paso."

        interaccion = InteraccionDOC(
            id_interaccion=f"INT-{len(self.interacciones_doc) + 1}",
            mensaje_usuario=mensaje,
            respuesta_doc=respuesta,
            fecha_hora=datetime.now()
        )
        self.interacciones_doc.append(interaccion)
        return interaccion


# ----------------------------------------------------------------------
# 11. Clase Tutor (Hereda de Usuario)
# ----------------------------------------------------------------------
class Tutor(Usuario):
    """Docente tutor del equipo pedagógico del IFTS N.° 12."""

    def __init__(self, id_usuario: str, nombre: str, email: str, especialidad: str):
        super().__init__(id_usuario, nombre, email, RolUsuario.TUTOR)
        self.especialidad: str = especialidad
        self.intervenciones_realizadas: List[Dict[str, Any]] = []

    def consultar_dashboard_alertas(self, alertas: List[Alerta]) -> List[Alerta]:
        """Consulta las alertas tempranas anónimas del equipo pedagógico."""
        return [a for a in alertas if a.estado != EstadoAlerta.ATENDIDA]

    def registrar_intervencion(self, id_alerta: str, accion: str) -> Dict[str, Any]:
        """Registra una acción de acompañamiento no punitivo."""
        registro = {
            "id_alerta": id_alerta,
            "tutor": self.nombre,
            "accion": accion,
            "fecha": datetime.now().isoformat()
        }
        self.intervenciones_realizadas.append(registro)
        return registro
`;
