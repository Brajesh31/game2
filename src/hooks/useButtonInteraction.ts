import { useState, useCallback } from 'react';
import { useToast } from '../components/ToastContainer';

interface ButtonState {
  loading: boolean;
  disabled: boolean;
  lastClicked: number;
}

interface UseButtonInteractionOptions {
  debounceMs?: number;
  showLoadingToast?: boolean;
  loadingMessage?: string;
}

export const useButtonInteraction = (options: UseButtonInteractionOptions = {}) => {
  const { debounceMs = 300, showLoadingToast = false, loadingMessage = 'Processing...' } = options;
  const { showToast } = useToast();
  const [buttonStates, setButtonStates] = useState<Record<string, ButtonState>>({});

  const handleButtonClick = useCallback(async (
    buttonId: string,
    action: () => Promise<void> | void,
    options?: { skipDebounce?: boolean; customLoadingMessage?: string }
  ) => {
    const now = Date.now();
    const currentState = buttonStates[buttonId];
    
    // Debounce check
    if (!options?.skipDebounce && currentState?.lastClicked && (now - currentState.lastClicked) < debounceMs) {
      return;
    }

    // Set loading state
    setButtonStates(prev => ({
      ...prev,
      [buttonId]: {
        loading: true,
        disabled: true,
        lastClicked: now
      }
    }));

    if (showLoadingToast) {
      showToast({
        type: 'info',
        title: options?.customLoadingMessage || loadingMessage,
        duration: 1000
      });
    }

    try {
      await action();
    } catch (error) {
      console.error('Button action failed:', error);
      showToast({
        type: 'error',
        title: 'Action Failed',
        message: 'Something went wrong. Please try again.',
        duration: 3000
      });
    } finally {
      // Reset button state
      setButtonStates(prev => ({
        ...prev,
        [buttonId]: {
          loading: false,
          disabled: false,
          lastClicked: now
        }
      }));
    }
  }, [buttonStates, debounceMs, showLoadingToast, loadingMessage, showToast]);

  const getButtonState = useCallback((buttonId: string): ButtonState => {
    return buttonStates[buttonId] || { loading: false, disabled: false, lastClicked: 0 };
  }, [buttonStates]);

  const resetButtonState = useCallback((buttonId: string) => {
    setButtonStates(prev => {
      const newState = { ...prev };
      delete newState[buttonId];
      return newState;
    });
  }, []);

  const setButtonDisabled = useCallback((buttonId: string, disabled: boolean) => {
    setButtonStates(prev => ({
      ...prev,
      [buttonId]: {
        ...prev[buttonId],
        disabled,
        loading: false,
        lastClicked: prev[buttonId]?.lastClicked || 0
      }
    }));
  }, []);

  return {
    handleButtonClick,
    getButtonState,
    resetButtonState,
    setButtonDisabled
  };
};

// Hook for quest-specific button interactions
export const useQuestButtonInteraction = () => {
  const baseHook = useButtonInteraction({
    debounceMs: 500,
    showLoadingToast: true,
    loadingMessage: 'Loading quest...'
  });

  const startQuest = useCallback(async (questId: string, onStart: (questId: string) => void) => {
    await baseHook.handleButtonClick(`start_quest_${questId}`, async () => {
      onStart(questId);
    }, { customLoadingMessage: 'Starting quest...' });
  }, [baseHook]);

  const continueQuest = useCallback(async (questId: string, onContinue: (questId: string) => void) => {
    await baseHook.handleButtonClick(`continue_quest_${questId}`, async () => {
      onContinue(questId);
    }, { customLoadingMessage: 'Continuing quest...' });
  }, [baseHook]);

  const completeQuest = useCallback(async (questId: string, onComplete: (questId: string) => void) => {
    await baseHook.handleButtonClick(`complete_quest_${questId}`, async () => {
      onComplete(questId);
    }, { customLoadingMessage: 'Completing quest...' });
  }, [baseHook]);

  return {
    ...baseHook,
    startQuest,
    continueQuest,
    completeQuest
  };
};

// Hook for experiment button interactions
export const useExperimentButtonInteraction = () => {
  const baseHook = useButtonInteraction({
    debounceMs: 400,
    showLoadingToast: true,
    loadingMessage: 'Loading experiment...'
  });

  const beginExperiment = useCallback(async (experimentId: string, onBegin: (experimentId: string) => void) => {
    await baseHook.handleButtonClick(`begin_experiment_${experimentId}`, async () => {
      onBegin(experimentId);
    }, { customLoadingMessage: 'Starting experiment...' });
  }, [baseHook]);

  const completeExperiment = useCallback(async (experimentId: string, onComplete: (experimentId: string) => void) => {
    await baseHook.handleButtonClick(`complete_experiment_${experimentId}`, async () => {
      onComplete(experimentId);
    }, { customLoadingMessage: 'Completing experiment...' });
  }, [baseHook]);

  return {
    ...baseHook,
    beginExperiment,
    completeExperiment
  };
};

// Hook for navigation button interactions
export const useNavigationButtonInteraction = () => {
  const baseHook = useButtonInteraction({
    debounceMs: 200,
    showLoadingToast: false
  });

  const navigateTo = useCallback(async (path: string, navigate: (path: string) => void) => {
    await baseHook.handleButtonClick(`navigate_${path}`, async () => {
      navigate(path);
    });
  }, [baseHook]);

  return {
    ...baseHook,
    navigateTo
  };
};