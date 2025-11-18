import { useState, useCallback, useEffect, useRef } from "react";
import { nativeAPI } from "../utils";
import { useHotspotEvents } from "./useHotspotEvents";

type HotspotState = 'RUNNING' | 'STOPPED';

export function useHotspot() {
  const hotspotEvents = useHotspotEvents();

  const [loading, setLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [lastKnownState, setLastKnownState] = useState<HotspotState>(
    hotspotEvents.isActive ? 'RUNNING' : 'STOPPED'
  );
  const [pendingTarget, setPendingTarget] = useState<HotspotState | null>(null);
  const [awaitingEventConfirmation, setAwaitingEventConfirmation] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const eventState: HotspotState = hotspotEvents.isActive ? 'RUNNING' : 'STOPPED';
    if (awaitingEventConfirmation) {
      if (eventState === lastKnownState) {
        setAwaitingEventConfirmation(false);
      }
      return;
    }

    if (lastKnownState !== eventState) {
      setLastKnownState(eventState);
    }
  }, [hotspotEvents.isActive, awaitingEventConfirmation, lastKnownState]);

  const toggleHotspot = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setOperationError(null);

    const currentVisualState: HotspotState = pendingTarget ?? lastKnownState;
    const targetState: HotspotState = currentVisualState === 'RUNNING' ? 'STOPPED' : 'RUNNING';
    setPendingTarget(targetState);

    try {
      if (targetState === 'RUNNING') {
        nativeAPI.hotspot.start();
      } else {
        nativeAPI.hotspot.stop();
      }

      const pollInterval = setInterval(() => {
        const currentStatus = nativeAPI.hotspot.getStatus();
        if (currentStatus === targetState) {
          clearTimers();
          setPendingTarget(null);
          setLastKnownState(targetState);
          setAwaitingEventConfirmation(true);

          timeoutRef.current = setTimeout(() => {
            setLoading(false);
          }, 350);
        }
      }, 150);

      pollIntervalRef.current = pollInterval;

      timeoutRef.current = setTimeout(() => {
        clearTimers();
        const fallbackState: HotspotState = nativeAPI.hotspot.getStatus() === 'RUNNING' ? 'RUNNING' : 'STOPPED';
        setPendingTarget(null);
        setAwaitingEventConfirmation(false);
        setLastKnownState(fallbackState);
        setLoading(false);
        setOperationError("Timeout en la operación del hotspot");
      }, 3000);
    } catch (error) {
      clearTimers();
      const fallbackState: HotspotState = nativeAPI.hotspot.getStatus() === 'RUNNING' ? 'RUNNING' : 'STOPPED';
      setPendingTarget(null);
      setAwaitingEventConfirmation(false);
      setLastKnownState(fallbackState);
      setLoading(false);
      setOperationError(error instanceof Error ? error.message : "Error en hotspot");
    }
  }, [clearTimers, lastKnownState, loading, pendingTarget]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const effectiveState: HotspotState = pendingTarget ?? lastKnownState;

  const checkStatus = useCallback(() => effectiveState, [effectiveState]);

  const isEnabled = effectiveState === 'RUNNING';

  return {
    isEnabled,
    loading,
    toggleHotspot,
    checkStatus,
    error: operationError,
    state: hotspotEvents.state,
    lastStateChange: hotspotEvents.lastStateChange
  };
}

