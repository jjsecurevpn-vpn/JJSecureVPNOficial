import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface TutorialStep {
  id: string;
  target: string; // CSS selector del elemento a resaltar
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: { x: number; y: number };
  showArrow?: boolean;
  /**
   * Separación mínima (en px) entre el tooltip y el elemento resaltado.
   * Si no se define, se usa el valor por defecto interno (extraGap + margin). 
   * Útil para targets muy pequeños o para crear más aire visual.
   */
  gap?: number;
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  isFirstTime: boolean;
  startTutorial: (steps: TutorialStep[]) => void;
  startAutoTutorial: (steps: TutorialStep[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  endTutorial: () => void;
  setSteps: (steps: TutorialStep[]) => void;
  markTutorialAsCompleted: () => void;
}

const TUTORIAL_COMPLETED_KEY = 'jjsecure-tutorial-completed';

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: React.ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Verificar si es la primera vez al montar el componente
  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    if (!hasCompletedTutorial) {
      setIsFirstTime(true);
    }
  }, []);

  const startTutorial = useCallback((tutorialSteps: TutorialStep[]) => {
    // Primero resetear el estado
    setIsActive(false);
    setCurrentStep(0);
    
    // Configurar los steps
    setSteps(tutorialSteps);
    
    // Activar el tutorial inmediatamente después
    setIsActive(true);
  }, []);

  const startAutoTutorial = useCallback((tutorialSteps: TutorialStep[]) => {
    // Solo iniciar si es primera vez
    if (isFirstTime) {
      startTutorial(tutorialSteps);
    }
  }, [isFirstTime, startTutorial]);

  const markTutorialAsCompleted = useCallback(() => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    setIsFirstTime(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTutorial();
    }
  }, [currentStep, steps.length]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
    // Marcar como completado cuando se salta
    if (isFirstTime) {
      markTutorialAsCompleted();
    }
  }, [isFirstTime, markTutorialAsCompleted]);

  const endTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
    // Marcar como completado cuando termina
    if (isFirstTime) {
      markTutorialAsCompleted();
    }
  }, [isFirstTime, markTutorialAsCompleted]);

  const value: TutorialContextType = {
    isActive,
    currentStep,
    steps,
    isFirstTime,
    startTutorial,
    startAutoTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    endTutorial,
    setSteps,
    markTutorialAsCompleted,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};
