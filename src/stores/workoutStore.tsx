import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';
import { indexedDBStorage } from '@/utils/indexedDBStorage';
import { convertIntensity, WeightConvert } from '@/utils/workoutUtils';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Exercise } from '../models/Exercise';
import { ExerciseSet, ExerciseSetIntensity, IntensityScale, SetType, SetWeight, WeightUnit } from '../models/ExerciseSet';
import { Workout } from '../models/Workout';
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

export interface WorkoutState {
  workout: Workout | null,
  workouts: Workout[],
  exerciseSearchMode: ExerciseSearchMode,
  selectedExerciseIndex: number,
  newWorkout: (user_id: string) => void,
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
  updateWorkoutDuration: (duration: number) => void,
  cleanupIncompleteSets: () => void,
  emptyWorkout: () => void,
  setWorkouts: (workouts: Workout[]) => void,
  setExerciseSearchMode: (mode: ExerciseSearchMode) => void,
  setSelectedExerciseIndex: (index: number) => void,
  setIntensityToExerciseSet: (exerciseId: string | number[], setIndex: number, intensity: ExerciseSetIntensity | undefined) => void,
  setRestTimeToExercise: (selectedExerciseIndex: number, seconds: number) => void,
  convertAllWorkoutUnits: () => void,
}

export const useWorkoutStore = create<WorkoutState>()(
  devtools(
    persist(
      (set) => ({
        workout: null,
        isTimerEnabled: false,
        workouts: [],
        exerciseSearchMode: ExerciseSearchMode.ADD_EXERCISE,
        selectedExerciseIndex: -1,
        emptyWorkout: () => set((state) => {
          return {
            ...state,
            isTimerEnabled: false,
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
          }
        }, true),
        addExercisesToWorkout: (exercises: Exercise[]) => {
          set((state) => {
            if (state.workout) {
              const workoutExercises: WorkoutExerciseType[] = exercises.map(exercise => ({
                id: uuidv4(),
                exercise,
                sets: [createNewSet()],
                notes: '',
                setInterval: null,
              }));

              //Create a new array with the added workout exercises without mutating the existing one
              const newWorkoutExercises = state.workout.workout_exercises
                ? [...state.workout.workout_exercises, ...workoutExercises]
                : workoutExercises;

              //Create a new workout object with the updated workout exercises
              const newWorkout = { ...state.workout, workout_exercises: newWorkoutExercises };

              return { ...state, workout: newWorkout };
            }
            return state;
          });
        },
        addSetToExercise: (exerciseId: string | number[]) => set((state) => {
          if (!state.workout || !state.workout.workout_exercises) return state;

          return {
            ...state,
            workout: {
              ...state.workout,
              workout_exercises: state.workout.workout_exercises.map((workout_exercise) => {
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
          if (!state.workout || !state.workout.workout_exercises) return state;

          return {
            ...state,
            workout: {
              ...state.workout,
              workout_exercises: state.workout.workout_exercises.map(workout_exercise => {
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
          if (!state.workout || !state.workout.workout_exercises) return state;
          return {
            ...state,
            workout: {
              ...state.workout,
              workout_exercises: state.workout.workout_exercises.map(workout_exercise => {
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
          if (!state.workout || !state.workout.workout_exercises) return state;

          return {
            ...state,
            workout: {
              ...state.workout,
              workout_exercises: state.workout.workout_exercises.map(workout_exercise => {
                if (workout_exercise.id === exerciseId) {
                  const newSets = [...workout_exercise.sets];
                  newSets[setIndex] = {
                    ...newSets[setIndex],
                    weight: setWeight //Create a new set object with updated weight
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
          if (!state.workout || !state.workout.workout_exercises) return state;

          return {
            ...state,
            workout: {
              ...state.workout,
              workout_exercises: state.workout.workout_exercises.map(workout_exercise => {
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
          if (!state.workout || !state.workout.workout_exercises) return state;

          const newWorkoutExercises = state.workout.workout_exercises.map((workoutExercise: WorkoutExerciseType, index: number) => {
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
            workout: {
              ...state.workout,
              workout_exercises: newWorkoutExercises
            }
          };
        }),
        updateNoteToExercise: (workingExerciseKey: number, note: string) => set((state) => {
          if (!state.workout || !state.workout.workout_exercises) return state;

          const newWorkoutExercises = state.workout.workout_exercises.map((workoutExercise: WorkoutExerciseType, index: number) => {
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
            workout: {
              ...state.workout,
              workout_exercises: newWorkoutExercises
            }
          };
        }),
        deleteExercise: (workingExerciseKey: number) => set((state) => {
          if (!state.workout || !state.workout.workout_exercises) return state;

          const newWorkoutExercises = state.workout.workout_exercises.filter((_exercise, index) => index !== workingExerciseKey);

          return {
            ...state,
            workout: {
              ...state.workout,
              workout_exercises: newWorkoutExercises
            }
          };
        }),
        toggleSetCompletion: (exerciseId: string | number[], setIndex: number) => set((state) => {
          if (!state.workout || !state.workout.workout_exercises) return state;

          const workout_exercises = state.workout.workout_exercises.map((workout_exercise) => {
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
            workout: {
              ...state.workout,
              workout_exercises,
            },
          };
        }),
        reorderExercises: (data: WorkoutExerciseType[]) => {
          set((state) => {
            if (!state.workout || !state.workout.workout_exercises) return state;

            const copy = [...data];

            return {
              ...state,
              workout: {
                ...state.workout,
                workout_exercises: copy,
              },
            };
          });
        },
        updateWorkoutDuration: (duration: number) => {
          set((state) => {
            if (!state.workout) return state;
            const updatedWorkout = {
              ...state.workout,
              duration: duration,
            };
            return {
              ...state,
              workout: updatedWorkout
            };

          });
        },
        setIsTimerEnabled: (boolean: boolean) => {
          set((state) => {
            return {
              ...state,
              isTimerEnabled: boolean
            }
          });
        },
        cleanupIncompleteSets: () => {
          //Removes all sets that are not completed
          set((state) => {
            if (!state.workout || !state.workout.workout_exercises) return state;

            const workout_exercises = state.workout.workout_exercises.map((workout_exercise) => {
              const newSets = workout_exercise.sets.filter((set) => set.completed);
              return { ...workout_exercise, sets: newSets };
            });

            return {
              ...state,
              workout: {
                ...state.workout,
                workout_exercises,
              },
            };
          });
        },
        setWorkouts: (workouts: Workout[]) => {
          set((state) => {
            return {
              ...state,
              workouts: workouts
            }
          });
        },
        setExerciseSearchMode: (mode: ExerciseSearchMode) => set({ exerciseSearchMode: mode }),
        setSelectedExerciseIndex: (index: number) => set({ selectedExerciseIndex: index }),
        setIntensityToExerciseSet: (exerciseId: string | number[], setIndex: number, intensity: ExerciseSetIntensity | undefined) => set((state) => {
          if (!state.workout || !state.workout.workout_exercises) return state;

          return {
            ...state,
            workout: {
              ...state.workout,
              workout_exercises: state.workout.workout_exercises.map(workout_exercise => {
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
          if (!state.workout || !state.workout.workout_exercises) return state;

          return {
            ...state,
            workout: {
              ...state.workout,
              workout_exercises: state.workout.workout_exercises.map((workout_exercise, index) => {
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
              // Si el set tiene intensidad definida, la convertimos
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
        })
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