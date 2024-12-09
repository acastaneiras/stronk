import { create } from 'zustand';

type TimerState = {
  activeExerciseId: string | null;
  activeSetId: string | null;
  startTimestamp: number | null;
  interval: number | null;
  startTimer: (exerciseId: string, setId: string, interval: number) => void;
  stopTimer: () => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  activeExerciseId: null,
  activeSetId: null,
  startTimestamp: null,
  interval: null,
  startTimer: (exerciseId, setId, interval) =>
    set({
      activeExerciseId: exerciseId,
      activeSetId: setId,
      startTimestamp: Date.now(),
      interval,
    }),
  stopTimer: () =>
    set({
      activeExerciseId: null,
      activeSetId: null,
      startTimestamp: null,
      interval: null,
    }),
}));
