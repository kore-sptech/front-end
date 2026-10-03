import { useCallback, useEffect, useMemo, useState } from "react";

import { buildColorMapByClient, buildWeekDays, buildWeekRange } from "./week";
import { listarAgendamentos } from "../../services/agendamentos";
import { handleApiError } from "../../utils/errorHandler";

/**
 * Hook: carrega os agendamentos da semana visível e os dados derivados da
 * grade (dias da semana, intervalo da consulta e cor por cliente).
 *
 * @param {object} [options]
 * @param {Date} [options.selectedDate] Dia que define a semana visível.
 * @returns {object} Sessões, dias da semana, cores e `refresh`.
 */
export function useWeekSchedule({ selectedDate: controlledDate } = {}) {
  const [internalDate, setInternalDate] = useState(
    () => controlledDate ?? new Date(),
  );
  const [sessions, setSessions] = useState([]);
  const [reloadToken, setReloadToken] = useState(0);

  const selectedDate = controlledDate ?? internalDate;

  const setSelectedDate = useCallback((date) => {
    if (date) setInternalDate(date);
  }, []);

  const weekDays = useMemo(() => buildWeekDays(selectedDate), [selectedDate]);

  const colorByClient = useMemo(
    () => buildColorMapByClient(sessions),
    [sessions],
  );

  const refresh = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let active = true;

    const { inicio, fim } = buildWeekRange(selectedDate);

    listarAgendamentos(inicio, fim)
      .then((response) => {
        if (!active) return;

        setSessions(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        if (!active) return;

        handleApiError(error, "Não foi possível carregar os agendamentos.");
        setSessions([]);
      });

    return () => {
      active = false;
    };
  }, [selectedDate, reloadToken]);

  return {
    sessions,
    weekDays,
    colorByClient,
    selectedDate,
    setSelectedDate,
    refresh,
  };
}