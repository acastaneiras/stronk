import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';
import { indexedDBStorage } from '@/utils/indexedDBStorage';
import { convertIntensity, WeightConvert } from '@/utils/workoutUtils';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Exercise } from '../models/Exercise';
import { ExerciseSet, ExerciseSetIntensity, IntensityScale, SetType, SetWeight, WeightUnit } from '../models/ExerciseSet';
import { Routine, Workout } from '@/models/Workout';
import { WorkoutExerciseType } from '../models/WorkoutExerciseType';
import { useUserStore } from './userStore';


const createNewSet = () => {

  const { user } = useUserStore.getState();

  return {
    id: 1,
    type: SetType.NormalSet,
    weight: {
      unit: user?.unitPreference || WeightUnit.KG,
      value: ''
    },
    reps: '',
    completed: false,
    number: 1,
  } as ExerciseSet
}

export enum StoreMode {
  WORKOUT = 'ADD_WORKOUT', //This is used to store the workout in progress
  ROUTINE = 'ROUTINE', //This is used to store the onging created routine or routine that it's being edited
  EDIT_WORKOUT = 'EDIT_WORKOUT', //This is used to store a past workout that is being edited
}

export interface WorkoutState {
  workout: Workout | null,
  editingWorkout: Workout | null,
  exerciseSearchMode: ExerciseSearchMode,
  selectedExerciseIndex: number,
  routine: Routine | null,
  storeMode: StoreMode,
  isHydrated: boolean,
  newWorkout: (userId: string) => void,
  newRoutine: (userId: string) => void,
  addExercisesToWorkout: (exercises: Exercise[]) => void,
  addSetToExercise: (exerciseId: string | number[]) => void,
  deleteSetToExercise: (exerciseId: string | number[], setIndex: number) => void,
  replaceExerciseInWorkout: (workingExerciseKey: number, exercise: Exercise) => void,
  updateNoteToExercise: (workingExerciseKey: number, note: string) => void,
  deleteExercise: (workingExerciseKey: number) => void,
  changeSetType: (exerciseId: string | number[], setIndex: number, setType: SetType) => void,
  toggleSetCompletion: (exerciseId: string | number[], setId: number) => void,
  changeRepsFromExercise: (exerciseId: string | number[], setIndex: number, reps: number | string) => void,
  changeWeightFromExercise: (exerciseId: string | number[], setIndex: number, setWeight: SetWeight) => void,
  reorderExercises: (data: WorkoutExerciseType[]) => void,
  emptyWorkout: () => void,
  setExerciseSearchMode: (mode: ExerciseSearchMode) => void,
  setSelectedExerciseIndex: (index: number) => void,
  setIntensityToExerciseSet: (exerciseId: string | number[], setIndex: number, intensity: ExerciseSetIntensity | undefined) => void,
  setRestTimeToExercise: (selectedExerciseIndex: number, seconds: number) => void,
  convertAllWorkoutUnits: () => void,
  setWorkout: (workout: Workout | null) => void,
  setStoreMode: (mode: StoreMode) => void,
  emptyRoutine: () => void,
  setRoutine: (routine: Routine | null) => void,
  setEditingWorkout: (workout: Workout | null) => void,
  setHydrated: () => void,
}

export const useWorkoutStore = create<WorkoutState>()(
  devtools(
    persist(
      (set) => ({
        workout: null,
        editingWorkout: null,
        exerciseSearchMode: ExerciseSearchMode.ADD_EXERCISE,
        selectedExerciseIndex: -1,
        routine: null,
        storeMode: StoreMode.WORKOUT,
        isHydrated: false,
        emptyWorkout: () => set((state) => {
          return {
            ...state,
            workout: null,
            storeMode: StoreMode.WORKOUT,
            routine: null,
          }
        }, true),
        updateWorkout: (workout: Workout) => set(() => ({ workout })),
        newWorkout: (userId: string) => set((state) => {
          const date = dayjs();
          const { user } = useUserStore.getState();
          return {
            ...state,
            workout: {
              ...state.workout, ...{
                id: null,
                userId,
                title: `${date.format("dddd, MMMM D, YYYY")} Workout 🏋️`,
                date: date,
                duration: null,
                sets: 0,
                units: user?.unitPreference || WeightUnit.KG,
                volume: 0,
                workout_exercises: [],
                completed: false,
              }
            },
            storeMode: StoreMode.WORKOUT,
          }
        }, true),
        newRoutine: (userId: string) => set((state) => {
          const date = dayjs();
          const { user } = useUserStore.getState();
          return {
            ...state,
            routine: {
              ...state.workout, ...{
                id: null,
                userId,
                title: ``,
                date: date,
                duration: null,
                sets: 0,
                volume: 0,
                units: user?.unitPreference || WeightUnit.KG,
                workout_exercises: [],
                completed: false,
              }
            },
            storeMode: StoreMode.ROUTINE
          }
        }, true),
        addExercisesToWorkout: (exercises: Exercise[]) => {
          set((state) => {
            const { targetState, targetKey } = getTargetStateAndKey(state);
            if (targetState) {
              const workoutExercises: WorkoutExerciseType[] = exercises.map(exercise => ({
                id: uuidv4(),
                exercise,
                sets: [createNewSet()],
                notes: '',
                setInterval: null,
              }));

              const newWorkoutExercises = targetState.workout_exercises
                ? [...targetState.workout_exercises, ...workoutExercises]
                : workoutExercises;

              const newState = {
                ...targetState,
                workout_exercises: newWorkoutExercises
              };

              return {
                ...state,
                [targetKey]: newState,
              };
            }
            return state;
          });
        },
        addSetToExercise: (exerciseId: string | number[]) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const updatedWorkoutExercises = targetState.workout_exercises.map((workoutExercise) => {
            if (workoutExercise.id === exerciseId) {
              const lastSetId = workoutExercise.sets[workoutExercise.sets.length - 1]?.id || 0;
              const defaultSet = createNewSet();
              const newSet: ExerciseSet = { ...defaultSet, id: lastSetId + 1 };
              const newSets = [...workoutExercise.sets, newSet];

              return {
                ...workoutExercise,
                sets: reorderExerciseSetNumber(newSets),
              };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: updatedWorkoutExercises,
            },
          };
        }),
        deleteSetToExercise: (exerciseId: string | number[], setIndex: number) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const updatedWorkoutExercises = targetState.workout_exercises.map((workoutExercise) => {
            if (workoutExercise.id === exerciseId) {
              const newSets = [...workoutExercise.sets];
              newSets.splice(setIndex, 1);
              const reorderedSets = reorderExerciseSetNumber(newSets);

              return { ...workoutExercise, sets: reorderedSets };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: updatedWorkoutExercises,
            },
          };
        }),
        changeRepsFromExercise: (exerciseId: string | number[], setIndex: number, reps: number | string) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const updatedWorkoutExercises = targetState.workout_exercises.map((workoutExercise) => {
            if (workoutExercise.id === exerciseId) {
              const newSets = [...workoutExercise.sets];
              newSets[setIndex] = { ...newSets[setIndex], reps };
              const reorderedSets = reorderExerciseSetNumber(newSets);
              return { ...workoutExercise, sets: reorderedSets };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: updatedWorkoutExercises,
            },
          };
        }),
        changeWeightFromExercise: (exerciseId: string | number[], setIndex: number, setWeight: SetWeight) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);
          const { user } = useUserStore.getState();
          if (!targetState || !targetState.workout_exercises) return state;

          const updatedWorkoutExercises = targetState.workout_exercises.map((workoutExercise) => {
            if (workoutExercise.id === exerciseId) {
              const newSets = [...workoutExercise.sets];
              newSets[setIndex] = {
                ...newSets[setIndex],
                weight: {
                  ...setWeight,
                  unit: user?.unitPreference || WeightUnit.KG,
                }
              };
              const reorderedSets = reorderExerciseSetNumber(newSets);
              return { ...workoutExercise, sets: reorderedSets };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: updatedWorkoutExercises,
            },
          };
        }),
        changeSetType: (exerciseId, setIndex, setType) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const updatedWorkoutExercises = targetState.workout_exercises.map((workoutExercise) => {
            if (workoutExercise.id === exerciseId) {
              const newSets = workoutExercise.sets.map((set, i) => {
                if (i === setIndex) {
                  return {
                    ...set,
                    type: setType,
                  };
                }
                return set;
              });

              const reorderedSets = reorderExerciseSetNumber(newSets);

              return {
                ...workoutExercise,
                sets: reorderedSets,
              };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: updatedWorkoutExercises,
            },
          };
        }),
        replaceExerciseInWorkout: (workingExerciseKey: number, exercise: Exercise) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const newWorkoutExercises = targetState.workout_exercises.map((workoutExercise: WorkoutExerciseType, index: number) => {
            if (index === workingExerciseKey) {
              return {
                id: uuidv4(),
                exercise,
                sets: [createNewSet()],
                notes: '',
                setInterval: null,
              };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: newWorkoutExercises,
            },
          };
        }),
        updateNoteToExercise: (workingExerciseKey: number, note: string) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const newWorkoutExercises = targetState.workout_exercises.map((workoutExercise: WorkoutExerciseType, index: number) => {
            if (index === workingExerciseKey) {
              return {
                ...workoutExercise,
                notes: note,
              };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: newWorkoutExercises,
            },
          };
        }),
        deleteExercise: (workingExerciseKey: number) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const newWorkoutExercises = targetState.workout_exercises.filter((_exercise, index) => index !== workingExerciseKey);

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: newWorkoutExercises,
            },
          };
        }),
        toggleSetCompletion: (exerciseId: string | number[], setIndex: number) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const updatedWorkoutExercises = targetState.workout_exercises.map((workoutExercise) => {
            if (workoutExercise.id === exerciseId) {
              const newSets = workoutExercise.sets.map((set, i) => {
                if (i === setIndex) {
                  return {
                    ...set,
                    completed: !set.completed,
                    reps: set.reps || 0,
                    weight: {
                      ...set.weight,
                      value: set.weight.value || 0,
                    },
                  };
                }
                return set;
              });
              return { ...workoutExercise, sets: newSets };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: updatedWorkoutExercises,
            },
          };
        }),
        reorderExercises: (data: WorkoutExerciseType[]) => {
          set((state) => {
            const { targetState, targetKey } = getTargetStateAndKey(state);

            if (!targetState || !targetState.workout_exercises) return state;

            const copy = [...data];

            return {
              ...state,
              [targetKey]: {
                ...targetState,
                workout_exercises: copy,
              },
            };
          });
        },
        setExerciseSearchMode: (mode: ExerciseSearchMode) => set({ exerciseSearchMode: mode }),
        setSelectedExerciseIndex: (index: number) => set({ selectedExerciseIndex: index }),
        setIntensityToExerciseSet: (exerciseId: string | number[], setIndex: number, intensity: ExerciseSetIntensity | undefined) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const updatedWorkoutExercises = targetState.workout_exercises.map((workoutExercise) => {
            if (workoutExercise.id === exerciseId) {
              const newSets = [...workoutExercise.sets];
              newSets[setIndex] = { ...newSets[setIndex], intensity };
              const reorderedSets = reorderExerciseSetNumber(newSets);
              return { ...workoutExercise, sets: reorderedSets };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: updatedWorkoutExercises,
            },
          };
        }),
        setRestTimeToExercise: (selectedExerciseIndex: number, seconds: number) => set((state) => {
          const { targetState, targetKey } = getTargetStateAndKey(state);

          if (!targetState || !targetState.workout_exercises) return state;

          const updatedWorkoutExercises = targetState.workout_exercises.map((workoutExercise, index) => {
            if (index === selectedExerciseIndex) {
              return { ...workoutExercise, setInterval: seconds };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [targetKey]: {
              ...targetState,
              workout_exercises: updatedWorkoutExercises,
            },
          };
        }),
        convertAllWorkoutUnits: () => set((state) => {
          if (!state.workout || !state.workout.workout_exercises) return state;

          const { user } = useUserStore.getState();
          const userUnits = user?.unitPreference ?? WeightUnit.KG;
          const userIntensityScale: IntensityScale = user?.intensitySetting as IntensityScale ?? IntensityScale.NONE;

          const newWorkoutExercises = state.workout.workout_exercises.map((workoutExercise) => {
            const newSets = workoutExercise.sets.map((set) => {
              //Convert the weight to the user's preference
              const currentIntensity: ExerciseSetIntensity = set.intensity as ExerciseSetIntensity;

              let convertedIntensity = currentIntensity;
              if (currentIntensity) {
                convertedIntensity = {
                  ...currentIntensity,
                  value: convertIntensity(currentIntensity.value, currentIntensity.scale, userIntensityScale)
                };
              }

              return {
                ...set,
                weight: {
                  unit: userUnits,
                  value: WeightConvert(set.weight, userUnits),
                },
                intensity: convertedIntensity
              };
            });

            return { ...workoutExercise, sets: newSets };
          });

          return {
            ...state,
            workout: {
              ...state.workout,
              workout_exercises: newWorkoutExercises
            }
          };
        }),
        setWorkout: (workout: Workout | null) => set({ workout }),
        setStoreMode: (mode: StoreMode) => set({ storeMode: mode }),
        emptyRoutine: () => set((state) => {
          return {
            ...state,
            routine: null,
            storeMode: StoreMode.WORKOUT
          }
        }),
        setRoutine: (routine: Routine | null) => set({ routine }),
        setEditingWorkout: (workout: Workout | null) => set({ editingWorkout: workout }),
        setHydrated: () => set({ isHydrated: true }),
      }),
      {
        name: 'currentWorkoutStore',
        storage: createJSONStorage(() => indexedDBStorage),
        version: 1.0,
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.setHydrated();
          }
        },
      }
    )
  )
);

const reorderExerciseSetNumber = (sets: ExerciseSet[]) => {
  const newSets: ExerciseSet[] = [...sets];
  let setNumber: number = 1;
  newSets.forEach((set) => {
    if (set.type === SetType.NormalSet || set.type === SetType.FailureSet) { //Only Normal and Failure increase the set number
      set.number = setNumber;
      setNumber++;
    }
  });

  return newSets;
};

//This function is used to get the target state and key based on the current store mode
const getTargetStateAndKey = (state: WorkoutState) => {
  if (state.storeMode === StoreMode.WORKOUT) {
    return { targetState: state.workout, targetKey: 'workout' };
  } else if (state.storeMode === StoreMode.ROUTINE) {
    return { targetState: state.routine, targetKey: 'routine' };
  } else if (state.storeMode === StoreMode.EDIT_WORKOUT) {
    return { targetState: state.editingWorkout, targetKey: 'editingWorkout' };
  }
  return { targetState: null, targetKey: null };
};