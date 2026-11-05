import React, { useState } from 'react';
import { ShieldAlert, Users, TrendingUp, CheckCircle, Clock, Filter, AlertTriangle, MessageSquare, Plus, Check } from 'lucide-react';
import { AlertaData } from '../../logic/doceCore';
import { ALERTAS_INSTITUCIONALES_INICIALES } from '../../data/initialData';

export const InstitutionalDashboardView: React.FC = () => {
  const [alertas, setAlertas] = useState<AlertaData[]>(ALERTAS_INSTITUCIONALES_INICIALES);
  const [filtroEstado, setFiltroEstado] = useState<'Todas' | 'Pendiente' | 'En Seguimiento' | 'Atendida'>('Todas');
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaData | null>(null);
  const [intervencionTexto, setIntervencionTexto] = useState('');

  const handleMarcarAtendida = (id: string) => {
    setAlertas((prev) =>
      prev.map((a) => (a.idAlerta === id ? { ...a, estado: 'Atendida' } : a))
    );
  };

  const handleGuardarIntervencion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlerta || !intervencionTexto.trim()) return;

    setAlertas((prev) =>
      prev.map((a) =>
        a.idAlerta === selectedAlerta.idAlerta
          ? {
              ...a,
              estado: 'En Seguimiento',
              intervencionSugerida: `${a.intervencionSugerida} | Tutor: ${intervencionTexto.trim()}`,
            }
          : a
      )
    );
    setSelectedAlerta(null);
    setIntervencionTexto('');
  };

  const alertasFiltradas = alertas.filter((a) =>
    filtroEstado === 'Todas' ? true : a.estado === filtroEstado
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <span>Pantalla 6</span>
          <span>·</span>
          <span>Dashboard Institucional de Tutorías</span>
          <span>·</span>
          <span>IFTS N.° 12</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
          Panel de Indicadores Agregados y Alerta Temprana
        </h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-3xl">
          Visualización anónima y agregada para el equipo de orientación y tutorías pedagógicas del IFTS N.° 12. Permite detectar indicios tempranos de deserción (sobrecarga laboral, viajes prolongados, atrasos en TPs) antes de que el estudiante abandone la carrera.
        </p>
      </div>

      {/* Aggregate Institutional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Permanencia Proyectada
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-700 tabular-nums mt-1">
            88.4%
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.2% vs cohorte anterior</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Alumnos en Acompañamiento
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            342
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Turnos Noche y Vespertino (IFTS 12)
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Alertas Preventivas Activas
          </div>
          <div className="text-3xl font-bold font-mono text-amber-600 tabular-nums mt-1">
            {alertas.filter((a) => a.estado !== 'Atendida').length}
          </div>
          <div className="text-xs text-amber-700 font-medium mt-1">
            Detección temprana no punitiva
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Intervenciones Docentes
          </div>
          <div className="text-3xl font-bold font-mono text-cyan-700 tabular-nums mt-1">
            46
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Tutorías y flexibilizaciones
          </div>
        </div>
      </div>

      {/* Alertas Anónimas Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              <span>Cola de Alertas de Acompañamiento Prioritario</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identidad anonimizada (código hash) para resguardar la privacidad del estudiante.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['Todas', 'Pendiente', 'En Seguimiento', 'Atendida'] as const).map((est) => (
              <button
                key={est}
                onClick={() => setFiltroEstado(est)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filtroEstado === est
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {est}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Código Anónimo</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Diagnóstico Socio-Académico</th>
                <th className="py-3 px-4">Intervención Sugerida</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alertasFiltradas.map((alerta) => (
                <tr key={alerta.idAlerta} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {alerta.codigoAnonimo}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {alerta.fechaGeneracion}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                    {alerta.motivo}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-sm leading-relaxed">
                    {alerta.intervencionSugerida}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        alerta.estado === 'Pendiente'
                          ? 'bg-amber-100 text-amber-800'
                          : alerta.estado === 'En Seguimiento'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {alerta.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => setSelectedAlerta(alerta)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                    >
                      Intervenir
                    </button>
                    {alerta.estado !== 'Atendida' && (
                      <button
                        onClick={() => handleMarcarAtendida(alerta.idAlerta)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
                      >
                        Atendida
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Register Intervention */}
      {selectedAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold font-heading text-slate-900 mb-1">
              Registrar Acción Tutelar: {selectedAlerta.codigoAnonimo}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Motivo: {selectedAlerta.motivo}
            </p>
            <form onSubmit={handleGuardarIntervencion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Acción pedagógica adoptada
                </label>
                <textarea
                  rows={3}
                  value={intervencionTexto}
                  onChange={(e) => setIntervencionTexto(e.target.value)}
                  placeholder="Ej: Se coordinó reunión asincrónica de tutoría y se extendió plazo de TP sin penalización..."
                  required
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAlerta(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  Guardar en Seguimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
