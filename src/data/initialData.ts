import { PerfilEstudioData, CursadaData, AlertaData } from '../logic/doceCore';

export interface StickyNote {
  id: string;
  tipo: 'meta' | 'victoria' | 'recordatorio' | 'doc';
  color: 'amber' | 'emerald' | 'cyan' | 'rose' | 'violet';
  titulo: string;
  contenido: string;
  fecha: string;
  completada?: boolean;
  rotacion?: number; // Grados sutiles para realismo del corcho
}

export interface Insignia {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  obtenida: boolean;
  fecha?: string;
  categoria: 'Constancia' | 'Enfoque' | 'Comunidad' | 'Superación';
}

export interface MicroObjetivo {
  id: string;
  materiaCodigo: string;
  titulo: string;
  duracionMinutos: number;
  completado: boolean;
  bloquePomodoro: number;
}

export const ESTUDIANTE_INICIAL = {
  idUsuario: 'usr-est-001',
  nombre: 'Martín Balbuena',
  email: 'ballemartin@gmail.com',
  legajo: 'IFTS12-2024-892',
  carrera: 'Tecnicatura Superior en Desarrollo de Software',
  cohorte: '2024',
  estiloAprendizaje: 'Visual-Sintético' as const,
  perfilEstudio: {
    cargaHorariaTrabajo: 36, // Horas semanales trabajo
    horasTraslado: 2.5,     // Horas diarias colectivo/tren
    personasACargo: 1,      // Familiar dependiente
    nivelEstres: 7,         // Autoreporte 1-10
    preferenciaRitmo: 'Enfoque en Bloques' as const,
  } as PerfilEstudioData,
};

export const NOTAS_CORCHO_INICIALES: StickyNote[] = [
  {
    id: 'nota-1',
    tipo: 'victoria',
    color: 'emerald',
    titulo: '🌟 Micro-Victoria de hoy',
    contenido: 'Completé el diagrama de clases en Python y entendí la agregación entre Cursada y Estudiante.',
    fecha: 'Hoy, 10:30',
    rotacion: -2,
  },
  {
    id: 'nota-2',
    tipo: 'doc',
    color: 'amber',
    titulo: '🤖 Mensaje de DOC',
    contenido: '“Venís con una semana demandante en el trabajo. Hoy encaramos solo 15 minutos de lectura. ¡Cada paso suma!”',
    fecha: 'Hoy, 08:15',
    rotacion: 1.5,
  },
  {
    id: 'nota-3',
    tipo: 'meta',
    color: 'cyan',
    titulo: '🎯 Meta Semanal',
    contenido: 'Entregar TP2 de Desarrollo de Software (endpoints Express + validación de datos).',
    fecha: 'Viernes 23:59',
    rotacion: -1,
  },
  {
    id: 'nota-4',
    tipo: 'recordatorio',
    color: 'violet',
    titulo: '☕ Espacio de Pausa',
    contenido: 'Hacer pausa activa de 5 minutos luego de 2 bloques Pomodoro. Estirar hombros y tomar agua.',
    fecha: 'Permanente',
    rotacion: 2,
  },
  {
    id: 'nota-5',
    tipo: 'victoria',
    color: 'emerald',
    titulo: '🎉 Victoria de Cursada',
    contenido: 'Aprobé el parcialito de Bases de Datos con 8.5. ¡El esfuerzo de estudiar en el tren rindió!',
    fecha: 'Ayer',
    rotacion: -2.5,
  }
];

export const CURSADAS_INICIALES: CursadaData[] = [
  {
    codigoMateria: 'DS-202',
    nombreMateria: 'Desarrollo de Software',
    anioLectivo: 2024,
    porcentajeAvance: 72,
    notaParcial: 8.0,
    asistenciaPorcentaje: 88,
    entregasAtrasadas: 0,
    temasDificiles: ['Patrones de Arquitectura', 'Inyección de Dependencias', 'API REST'],
  },
  {
    codigoMateria: 'BD-101',
    nombreMateria: 'Bases de Datos I',
    anioLectivo: 2024,
    porcentajeAvance: 65,
    notaParcial: 7.5,
    asistenciaPorcentaje: 82,
    entregasAtrasadas: 1,
    temasDificiles: ['Normalización 3FN', 'Subconsultas Correlacionadas', 'Índices B-Tree'],
  },
  {
    codigoMateria: 'AED-201',
    nombreMateria: 'Algoritmos y Estructuras de Datos',
    anioLectivo: 2024,
    porcentajeAvance: 80,
    notaParcial: 9.0,
    asistenciaPorcentaje: 91,
    entregasAtrasadas: 0,
    temasDificiles: ['Recursividad de Cola', 'Árboles Binarios de Búsqueda', 'Grafos BFS/DFS'],
  },
  {
    codigoMateria: 'SO-102',
    nombreMateria: 'Sistemas Operativos',
    anioLectivo: 2024,
    porcentajeAvance: 58,
    notaParcial: 6.5,
    asistenciaPorcentaje: 74,
    entregasAtrasadas: 2,
    temasDificiles: ['Paginación y Memoria Virtual', 'Planificación de Procesos Round Robin', 'Deadlocks'],
  }
];

export const MICRO_OBJETIVOS_INICIALES: MicroObjetivo[] = [
  {
    id: 'obj-1',
    materiaCodigo: 'DS-202',
    titulo: 'Revisar consigna del TP2 e identificar 3 requerimientos funcionales',
    duracionMinutos: 15,
    completado: true,
    bloquePomodoro: 1,
  },
  {
    id: 'obj-2',
    materiaCodigo: 'DS-202',
    titulo: 'Implementar modelo de datos y rutas base en Express',
    duracionMinutos: 25,
    completado: false,
    bloquePomodoro: 2,
  },
  {
    id: 'obj-3',
    materiaCodigo: 'BD-101',
    titulo: 'Ejercicios de normalización a Tercera Forma Normal (3FN)',
    duracionMinutos: 25,
    completado: false,
    bloquePomodoro: 3,
  },
  {
    id: 'obj-4',
    materiaCodigo: 'SO-102',
    titulo: 'Desglosar con DOC el capítulo de Memoria Virtual en 3 puntos',
    duracionMinutos: 15,
    completado: false,
    bloquePomodoro: 1,
  }
];

export const INSIGNIAS_INICIALES: Insignia[] = [
  {
    id: 'ins-1',
    titulo: 'Primer Micro-Paso',
    descripcion: 'Completaste tu primera sesión de estudio de 15 minutos en la plataforma.',
    icono: 'Seedling',
    obtenida: true,
    fecha: '02 Mar 2024',
    categoria: 'Constancia',
  },
  {
    id: 'ins-2',
    titulo: 'Superador de Bloqueo',
    descripcion: 'Desglosaste un texto complejo con DOC y pudiste avanzar sin frustración.',
    icono: 'Zap',
    obtenida: true,
    fecha: '18 Abr 2024',
    categoria: 'Superación',
  },
  {
    id: 'ins-3',
    titulo: 'Ritmo Sostenido',
    descripcion: 'Estudiaste 3 días consecutivos respetando tus bloques de descanso.',
    icono: 'Flame',
    obtenida: true,
    fecha: '28 May 2024',
    categoria: 'Constancia',
  },
  {
    id: 'ins-4',
    titulo: 'Guardián del Enfoque',
    descripcion: 'Completaste 4 bloques Pomodoro adaptativos con sonido ambiental.',
    icono: 'Clock',
    obtenida: true,
    fecha: '12 Jun 2024',
    categoria: 'Enfoque',
  },
  {
    id: 'ins-5',
    titulo: 'Compañero Solidario',
    descripcion: 'Compartiste una síntesis de apuntes en el foro del IFTS 12.',
    icono: 'Users',
    obtenida: false,
    categoria: 'Comunidad',
  },
  {
    id: 'ins-6',
    titulo: 'Hacia el Título Técnico',
    descripcion: 'Alcanzar el 75% del plan de cursada de la Tecnicatura.',
    icono: 'GraduationCap',
    obtenida: false,
    categoria: 'Constancia',
  }
];

export const ALERTAS_INSTITUCIONALES_INICIALES: AlertaData[] = [
  {
    idAlerta: 'ALT-1092',
    estudianteId: 'usr-est-409',
    codigoAnonimo: 'EST-4091',
    estado: 'Pendiente',
    fechaGeneracion: '04 Nov 2024',
    motivo: 'Asistencia reducida al 68% en Sistemas Operativos + 38 hs laborales.',
    intervencionSugerida: 'Ofrecer tutoría de nivelación asincrónica y revisión de horario de entrega.',
  },
  {
    idAlerta: 'ALT-1088',
    estudianteId: 'usr-est-881',
    codigoAnonimo: 'EST-8812',
    estado: 'En Seguimiento',
    fechaGeneracion: '02 Nov 2024',
    motivo: '2 entregas atrasadas en Bases de Datos + tiempo de traslado > 2.5 hs.',
    intervencionSugerida: 'Reunión de orientación pedagógica con Tutoría IFTS 12 (sin penalización).',
  },
  {
    idAlerta: 'ALT-1075',
    estudianteId: 'usr-est-203',
    codigoAnonimo: 'EST-2034',
    estado: 'Atendida',
    fechaGeneracion: '28 Oct 2024',
    motivo: 'Desánimo detectado en interacción con DOC + sobrecarga laboral.',
    intervencionSugerida: 'Plan de cursada flexibilizado en micro-objetivos. Estudiante retomó actividades.',
  }
];
