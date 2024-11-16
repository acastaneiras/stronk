import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Exercise } from '../models/Exercise';
import { indexedDBStorage } from '@/utils/indexedDBStorage';

const EXERCISES_VERSION = import.meta.env.VITE_EXERCISES_VERSION;

export interface ExercisesState {
  allEquipment: string[] | null;
  allExercises: Exercise[] | null;
  allCategories: string[] | null;
  allMuscles: string[] | null;
  version: number;
  isHydrated: boolean;
  addExercises: (exercises: Exercise[] | null) => void;
  addEquipment: (equipment: string[] | null) => void;
  addCategories: (category: string[] | null) => void;
  addMuscles: (muscle: string[] | null) => void;
  setVersion: (newVersion: number) => void;
  setHydrated: () => void;
}

export const useExercisesStore = create<ExercisesState>()(
  devtools(
    persist(
      (set) => ({
        allExercises: null,
        allEquipment: null,
        allCategories: null,
        allMuscles: null,
        version: 0,
        isHydrated: false,
        addExercises: (exercises: Exercise[] | null) =>
          set(() => ({
            allExercises: exercises,
          })),
        addEquipment: (equipment: string[] | null) =>
          set(() => ({
            allEquipment: equipment,
          })),
        addCategories: (category: string[] | null) =>
          set(() => ({
            allCategories: category,
          })),
        addMuscles: (muscle: string[] | null) =>
          set(() => ({
            allMuscles: muscle,
          })),
        setVersion: (newVersion: number) =>
          set(() => ({
            version: newVersion,
          })),
        setHydrated: () =>
          set(() => ({
            isHydrated: true,
          })),
      }),
      {
        name: 'userExercisesStorage',
        storage: createJSONStorage(() => indexedDBStorage),
        version: Number(EXERCISES_VERSION),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.setHydrated();
          }
        },
        migrate: async (persistedState: unknown, version) => {
          const targetVersion = Number(EXERCISES_VERSION);
          if (version < targetVersion) {
            const oldState = persistedState as ExercisesState;
            return {
              ...oldState,
              allExercises: null,
              allEquipment: null,
              allCategories: null,
              allMuscles: null,
              version: targetVersion,
            };
          }

          return persistedState;
        },
      }
    )
  )
);
