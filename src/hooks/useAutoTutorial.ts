import { useEffect } from 'react';
import { useTutorial } from '../context/TutorialContext';
import { appTutorialSteps } from '../components/tutorial/tutorialSteps';

/**
 * Hook para manejar el inicio automático del tutorial en la primera visita
 */
export const useAutoTutorial = (showWelcomeScreen: boolean) => {
  const { isFirstTime, startAutoTutorial } = useTutorial();

  useEffect(() => {
    // Solo ejecutar si:
    // 1. Es la primera vez
    // 2. Welcome screen no está activo (ya se cerró)
    if (isFirstTime && !showWelcomeScreen) {
      const timer = setTimeout(() => {
        console.log('🎯 [AUTO-TUTORIAL] Iniciando tutorial automático después de cerrar Welcome');
        startAutoTutorial(appTutorialSteps);
      }, 500); // Menor delay ya que Welcome ya se cerró

      return () => clearTimeout(timer);
    }
  }, [isFirstTime, showWelcomeScreen, startAutoTutorial]);

  return {
    isFirstTime
  };
};
