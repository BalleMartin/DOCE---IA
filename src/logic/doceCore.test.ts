import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AgenteDOC,
  EvaluadorPerfilEstudio,
  RedNeuronalPredictiva,
  PerfilEstudioData,
  CODIGO_PYTHON_UML_OFICIAL
} from './doceCore.ts';

test('AgenteDOC - counts words correctly and enforces < 180 words rule', () => {
  const shortText = 'Hola estudiante, venís trabajando duro.';
  assert.equal(AgenteDOC.contarPalabras(shortText), 5);
  assert.equal(AgenteDOC.validarLimitePalabras(shortText, 180), true);

  const agente = new AgenteDOC();
  const mensajeDesanimo = agente.generarMensajeMotivacional('Martin', true);
  const cantPalabras = AgenteDOC.contarPalabras(mensajeDesanimo);
  assert.ok(cantPalabras > 10, 'El mensaje motivacional debe tener contenido');
  assert.ok(cantPalabras < 180, 'El mensaje debe tener menos de 180 palabras');
  assert.ok(mensajeDesanimo.includes('15 minutos'), 'Debe incluir la propuesta de 15 minutos');
  assert.ok(mensajeDesanimo.includes('trabajando muy duro'), 'Debe reconocer el esfuerzo');
});

test('AgenteDOC - breaks down any reading into EXACTLY 3 key points', () => {
  const agente = new AgenteDOC();
  const textoLargo = `
    La arquitectura cliente-servidor divide las tareas entre los proveedores de recursos (servidores) y los demandantes (clientes).
    Los clientes inician peticiones HTTP hacia endpoints centralizados que procesan la lógica de negocio.
    Las bases de datos relacionales garantizan propiedades ACID para mantener consistencia transaccional en sistemas críticos.
    Finalmente, los mecanismos de caché como Redis reducen la latencia de respuesta en arquitecturas distribuidas de alta demanda.
  `;

  const puntos = agente.desglosarLectura(textoLargo);
  assert.equal(puntos.length, 3, 'Debe devolver exactamente 3 puntos clave');
  assert.ok(puntos[0].startsWith('1.'), 'Punto 1 debe comenzar con 1.');
  assert.ok(puntos[1].startsWith('2.'), 'Punto 2 debe comenzar con 2.');
  assert.ok(puntos[2].startsWith('3.'), 'Punto 3 debe comenzar con 3.');
});

test('AgenteDOC - triggers fallback contingency mode with 3 cached points', () => {
  const agente = new AgenteDOC();
  const fallback = agente.activarFallback('Normalización de Bases de Datos');
  assert.equal(fallback.puntos.length, 3);
  assert.ok(fallback.nota.includes('Modo contingencia'));
});

test('EvaluadorPerfilEstudio - calculates vulnerability ethically and without stigma', () => {
  const perfilVulnerable: PerfilEstudioData = {
    cargaHorariaTrabajo: 40, // Jornada completa
    horasTraslado: 2.5,      // Viaje largo
    personasACargo: 1,       // Cuidado familiar
    nivelEstres: 8,          // Alto estrés
    preferenciaRitmo: 'Enfoque en Bloques'
  };

  const resultado = EvaluadorPerfilEstudio.esVulnerable(perfilVulnerable);
  assert.equal(resultado.esVulnerable, true);
  assert.equal(resultado.nivelPrioridad, 'Alta');
  assert.ok(resultado.motivos.length >= 3);

  const perfilEstable: PerfilEstudioData = {
    cargaHorariaTrabajo: 0,
    horasTraslado: 0.5,
    personasACargo: 0,
    nivelEstres: 3,
    preferenciaRitmo: 'Visual-Sintético'
  };

  const resultadoEstable = EvaluadorPerfilEstudio.esVulnerable(perfilEstable);
  assert.equal(resultadoEstable.esVulnerable, false);
  assert.equal(resultadoEstable.nivelPrioridad, 'Baja');
});

test('RedNeuronalPredictiva - evaluates dropout risk with pedagogical orientation', () => {
  const rnp = new RedNeuronalPredictiva();
  assert.equal(rnp.f1Score, 0.89);

  const pred = rnp.evaluarRiesgo({
    cargaLaboral: 40,
    horasViaje: 2.5,
    asistenciaPorcentaje: 65,
    entregasAtrasadas: 3,
    nivelEstres: 9
  });

  assert.equal(pred.nivelRiesgo, 'Alto');
  assert.ok(pred.probabilidadDesercion >= 0.6);
  assert.ok(pred.orientacionPedagogica.includes('no punitivo'));
});

test('CODIGO_PYTHON_UML_OFICIAL - contains all 11 classes from UML official model', () => {
  const clasesRequeridas = [
    'class Usuario',
    'class Estudiante(Usuario)',
    'class PerfilEstudio',
    'class Cursada',
    'class ResultadoAcademico',
    'class RedNeuronalPredictiva',
    'class PrediccionRiesgo',
    'class Alerta',
    'class AgenteDOC',
    'class InteraccionDOC',
    'class Tutor(Usuario)'
  ];

  for (const clase of clasesRequeridas) {
    assert.ok(
      CODIGO_PYTHON_UML_OFICIAL.includes(clase),
      `El código Python debe contener la definición de ${clase}`
    );
  }
});
