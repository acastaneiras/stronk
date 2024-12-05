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
  WORKOUT = 'WORKOUT',
  ROUTINE = 'ROUTINE'
}

export interface WorkoutState {
  workout: Workout | null,
  onGoingWorkout: Workout | null, //This is used to store the workout in progress
  fetchedWorkout: Workout | null, //This is used to store the workout fetched from the server, in order to compare it with the current workout while editing
  exerciseSearchMode: ExerciseSearchMode,
  selectedExerciseIndex: number,
  isEditing: boolean,
  routine: Routine | null,
  storeMode: StoreMode,
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
  setOnGoingWorkout: (workout: Workout | null) => void,
  setIsEditing: (isEditing: boolean) => void,
  setWorkout: (workout: Workout | null) => void,
  setFetchedWorkout: (workout: Workout | null) => void,
  emptyEditWorkout: () => void,
  setStoreMode: (mode: StoreMode) => void,
  emptyRoutine: () => void,
  setRoutineTitle: (title: string) => void,
}

export const useWorkoutStore = create<WorkoutState>()(
  devtools(
    persist(
      (set) => ({
        workout: null,
        onGoingWorkout: null,
        exerciseSearchMode: ExerciseSearchMode.ADD_EXERCISE,
        selectedExerciseIndex: -1,
        isEditing: false,
        fetchedWorkout: null,
        routine: null,
        storeMode: StoreMode.WORKOUT,
        emptyWorkout: () => set((state) => {
          return {
            ...state,
            workout: null,
          }
        }, true),
        updateWorkout: (workout: Workout) => set(() => ({ workout })),
        newWorkout: (userId: string) => set((state) => {
          const date = dayjs();
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
                volume: 0,
                workout_exercises: [],
                completed: false,
              }
            },
            storeMode: StoreMode.WORKOUT
          }
        }, true),
        newRoutine: (userId: string) => set((state) => {
          const date = dayjs();
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
                workout_exercises: [],
                completed: false,
              }
            },
            storeMode: StoreMode.ROUTINE
          }
        }, true),
        addExercisesToWorkout: (exercises: Exercise[]) => {
          set((state) => {
            const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
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
                [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: newState,
              };
            }
            return state;
          });
        },
        addSetToExercise: (exerciseId: string | number[]) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: targetState.workout_exercises.map((workout_exercise) => {
                if (workout_exercise.id === exerciseId) {
                  const lastSetId = workout_exercise.sets[workout_exercise.sets.length - 1]?.id || 0;
                  const defaultSet = createNewSet();
                  const newSet: ExerciseSet = { ...defaultSet, id: lastSetId + 1 };
                  const newSets = [...workout_exercise.sets, newSet];
                  workout_exercise = {
                    ...workout_exercise,
                    sets: reorderExerciseSetNumber(newSets),
                  };
                }
                return { ...workout_exercise };
              }),
            },
          };
        }),
        deleteSetToExercise: (exerciseId: string | number[], setIndex: number) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: targetState.workout_exercises.map(workout_exercise => {
                if (workout_exercise.id === exerciseId) {
                  const newSets = [...workout_exercise.sets];
                  newSets.splice(setIndex, 1);
                  const reorderedSets = reorderExerciseSetNumber(newSets);

                  return { ...workout_exercise, sets: reorderedSets };
                }
                return workout_exercise;
              })
            }
          };
        }),
        changeRepsFromExercise: (exerciseId: string | number[], setIndex: number, reps: number | string) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: targetState.workout_exercises.map(workout_exercise => {
                if (workout_exercise.id === exerciseId) {
                  const newSets = [...workout_exercise.sets];
                  newSets[setIndex] = { ...newSets[setIndex], reps: reps };
                  const reorderedSets = reorderExerciseSetNumber(newSets);
                  return { ...workout_exercise, sets: reorderedSets };
                }
                return workout_exercise;
              })
            }
          };
        }),
        changeWeightFromExercise: (exerciseId: string | number[], setIndex: number, setWeight: SetWeight) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: targetState.workout_exercises.map(workout_exercise => {
                if (workout_exercise.id === exerciseId) {
                  const newSets = [...workout_exercise.sets];
                  newSets[setIndex] = {
                    ...newSets[setIndex],
                    weight: setWeight // Create a new set object with updated weight
                  };
                  const reorderedSets = reorderExerciseSetNumber(newSets);
                  return { ...workout_exercise, sets: reorderedSets };
                }
                return workout_exercise;
              })
            }
          };
        }),
        changeSetType: (exerciseId, setIndex, setType) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: targetState.workout_exercises.map(workout_exercise => {
                if (workout_exercise.id === exerciseId) {
                  const newSets = workout_exercise.sets.map((set, i) => {
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
                    ...workout_exercise,
                    sets: reorderedSets,
                  };
                }
                return workout_exercise;
              })
            }
          };
        }),
        replaceExerciseInWorkout: (workingExerciseKey: number, exercise: Exercise) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
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
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: newWorkoutExercises
            }
          };
        }),
        updateNoteToExercise: (workingExerciseKey: number, note: string) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          const newWorkoutExercises = targetState.workout_exercises.map((workoutExercise: WorkoutExerciseType, index: number) => {
            if (index === workingExerciseKey) {
              return {
                ...workoutExercise,
                notes: note
              };
            }
            return workoutExercise;
          });

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: newWorkoutExercises
            }
          };
        }),
        deleteExercise: (workingExerciseKey: number) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          const newWorkoutExercises = targetState.workout_exercises.filter((_exercise, index) => index !== workingExerciseKey);

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: newWorkoutExercises
            }
          };
        }),
        toggleSetCompletion: (exerciseId: string | number[], setIndex: number) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          const updatedWorkoutExercises = targetState.workout_exercises.map((workout_exercise) => {
            if (workout_exercise.id === exerciseId) {
              const newSets = workout_exercise.sets.map((set, i) => {
                if (i === setIndex) {
                  return {
                    ...set,
                    completed: !set.completed,
                    reps: set.reps || 0,
                    weight: {
                      ...set.weight,
                      value: set.weight.value || 0
                    }
                  };
                }
                return set;
              });
              return { ...workout_exercise, sets: newSets };
            }
            return workout_exercise;
          });

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: updatedWorkoutExercises,
            },
          };
        }),
        reorderExercises: (data: WorkoutExerciseType[]) => {
          set((state) => {
            const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
            if (!targetState || !targetState.workout_exercises) return state;

            const copy = [...data];

            return {
              ...state,
              [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
                ...targetState,
                workout_exercises: copy,
              },
            };
          });
        },
        setExerciseSearchMode: (mode: ExerciseSearchMode) => set({ exerciseSearchMode: mode }),
        setSelectedExerciseIndex: (index: number) => set({ selectedExerciseIndex: index }),
        setIntensityToExerciseSet: (exerciseId: string | number[], setIndex: number, intensity: ExerciseSetIntensity | undefined) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: targetState.workout_exercises.map(workout_exercise => {
                if (workout_exercise.id === exerciseId) {
                  const newSets = [...workout_exercise.sets];
                  newSets[setIndex] = { ...newSets[setIndex], intensity: intensity };
                  const reorderedSets = reorderExerciseSetNumber(newSets);
                  return { ...workout_exercise, sets: reorderedSets };
                }
                return workout_exercise;
              })
            }
          };
        }),
        setRestTimeToExercise: (selectedExerciseIndex: number, seconds: number) => set((state) => {
          const targetState = state.storeMode === StoreMode.WORKOUT ? state.workout : state.routine;
          if (!targetState || !targetState.workout_exercises) return state;

          return {
            ...state,
            [state.storeMode === StoreMode.WORKOUT ? 'workout' : 'routine']: {
              ...targetState,
              workout_exercises: targetState.workout_exercises.map((workout_exercise, index) => {
                if (index === selectedExerciseIndex) {
                  return { ...workout_exercise, setInterval: seconds };
                }
                return workout_exercise;
              })
            }
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
        setOnGoingWorkout: (workout: Workout | null) => set({ onGoingWorkout: workout }),
        setIsEditing: (isEditing: boolean) => set({ isEditing }),
        setWorkout: (workout: Workout | null) => set({ workout }),
        setFetchedWorkout: (workout: Workout | null) => set({ fetchedWorkout: workout }),
        emptyEditWorkout: () => set((state) => {
          if (!state.workout) return state;
          const savedWorkout = state.onGoingWorkout ?? null;

          return {
            ...state,
            workout: savedWorkout,
            fetchedWorkout: null,
            onGoingWorkout: null,
            isEditing: false,
            storeMode: StoreMode.WORKOUT
          };
        }),
        setStoreMode: (mode: StoreMode) => set({ storeMode: mode }),
        emptyRoutine: () => set((state) => {
          return {
            ...state,
            routine: null,
            storeMode: StoreMode.WORKOUT
          }
        }),
        setRoutineTitle: (title: string) => set((state) => {
          if (!state.routine) return state;

          return {
            ...state,
            routine: {
              ...state.routine,
              title
            }
          };
        }),
      }),
      {
        name: 'currentWorkoutStore',
        storage: createJSONStorage(() => indexedDBStorage),
        version: 1.0,
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