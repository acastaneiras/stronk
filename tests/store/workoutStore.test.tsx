import { Exercise } from '@/models/Exercise';
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';
import { ExerciseSet, ExerciseSetIntensity, IntensityScale, SetType, WeightUnit } from '@/models/ExerciseSet';
import { Routine, Workout } from '@/models/Workout';
import { UserState, useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore, WorkoutState } from '@/stores/workoutStore';
import dayjs from 'dayjs';
import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';


// Mock Exercise
const exercise: Exercise = {
  id: "1",
  guid: "Bench_Press_-_Powerlifting",
  name: "Bench Press",
  category: "Strength",
  primaryMuscles: ["Chest"],
  secondaryMuscles: ["Triceps", "Shoulders"],
  equipment: "Barbell",
  instructions: ["Lie on a flat bench", "Grip the barbell with hands slightly wider than shoulder-width apart"],
  images: ["https://example.com/bench_press.jpg"],
  isCustom: false,
  createdAt: new Date(),
};

// Mock Set
const mockSet: ExerciseSet = {
  id: 0,
  weight: {
    value: 50,
    unit: WeightUnit.KG,
  },
  reps: 10,
  completed: false,
  intensity: {
    scale: IntensityScale.RPE,
    value: 8,
  },
  type: SetType.NormalSet,
  number: 1,
};

describe('Workout Store', () => {
  beforeEach(() => {
    useWorkoutStore.setState((state: Partial<WorkoutState>) => ({
      // Reset the state
      ...state,
      workout: null,
      editingWorkout: null,
      exerciseSearchMode: ExerciseSearchMode.ADD_EXERCISE,
      selectedExerciseIndex: -1,
      routine: null,
      storeMode: StoreMode.WORKOUT,
      isHydrated: false,
    }));

    useUserStore.setState((state: Partial<UserState>) => ({
      ...state,
      user: null,
      isUserSetupComplete: null,
    }));
  });

  it('should initialize with the correct default state', () => {
    const state = useWorkoutStore.getState();
    expect(state.workout).toBeNull();
    expect(state.routine).toBeNull();
    expect(state.storeMode).toBe(StoreMode.WORKOUT);
  });

  it('should create a new workout', () => {
    const { newWorkout } = useWorkoutStore.getState();
    newWorkout('user123');

    const state = useWorkoutStore.getState();
    expect(state.workout).not.toBeNull();
    expect(state.workout?.userId).toBe('user123');
    expect(state.workout?.workout_exercises).toHaveLength(0);
  });

  it('should add an exercise to the workout', () => {
    const { newWorkout, addExercisesToWorkout } = useWorkoutStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);

    const state = useWorkoutStore.getState();
    expect(state.workout?.workout_exercises).toHaveLength(1);
    expect(state.workout?.workout_exercises[0].exercise.name).toBe('Bench Press');
  });

  it('should add a set to an exercise', () => {
    const { newWorkout, addExercisesToWorkout, addSetToExercise } = useWorkoutStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);
    const exerciseId = useWorkoutStore.getState().workout?.workout_exercises[0].id;

    addSetToExercise(exerciseId || '');

    const updatedExercise = useWorkoutStore.getState().workout?.workout_exercises[0];
    expect(updatedExercise?.sets).toHaveLength(2);
  });

  it('should toggle set completion', () => {
    const { newWorkout, addExercisesToWorkout, toggleSetCompletion } = useWorkoutStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);
    const exerciseId = useWorkoutStore.getState().workout?.workout_exercises[0].id;

    toggleSetCompletion(exerciseId || '', 0);

    const updatedExercise = useWorkoutStore.getState().workout?.workout_exercises[0];
    expect(updatedExercise?.sets[0].completed).toBe(true);
  });

  it('should change reps for a set', () => {
    const { newWorkout, addExercisesToWorkout, changeRepsFromExercise } = useWorkoutStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);
    const exerciseId = useWorkoutStore.getState().workout?.workout_exercises[0].id;

    changeRepsFromExercise(exerciseId || '', 0, 12);

    const updatedExercise = useWorkoutStore.getState().workout?.workout_exercises[0];
    expect(updatedExercise?.sets[0].reps).toBe(12);
  });

  it('should delete a set from an exercise', () => {
    const { newWorkout, addExercisesToWorkout, deleteSetToExercise } = useWorkoutStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);
    const exerciseId = useWorkoutStore.getState().workout?.workout_exercises[0].id;

    deleteSetToExercise(exerciseId || '', 0);

    const updatedExercise = useWorkoutStore.getState().workout?.workout_exercises[0];
    expect(updatedExercise?.sets).toHaveLength(0);
  });

  it('should handle unit conversion correctly', () => {
    const { newWorkout, addExercisesToWorkout, convertAllWorkoutUnits, changeWeightFromExercise } = useWorkoutStore.getState();
    const { setUser } = useUserStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);

    const stateBefore = useWorkoutStore.getState();
    // Add a set with 100 KG
    changeWeightFromExercise(stateBefore.workout?.workout_exercises[0].id?.toString() || '', 0, { value: 100, unit: WeightUnit.KG });

    // Change user preference to LB
    setUser({
      ...useUserStore.getState().user!,
      unitPreference: WeightUnit.LB,
    })

    // Conert all workout sets to the user units
    convertAllWorkoutUnits();

    const stateAfter = useWorkoutStore.getState();
    const convertedSet = stateAfter.workout?.workout_exercises[0].sets[0];

    // Expect the weight to be converted to LB and the value to be approximately 220.46 LB (100kg aprox)
    expect(convertedSet?.weight.unit).toBe(WeightUnit.LB);
    expect(convertedSet?.weight.value).toBeCloseTo(220.46);
  });

  it('should replace an exercise in the workout', () => {
    const { newWorkout, addExercisesToWorkout, replaceExerciseInWorkout } = useWorkoutStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);
  
    const stateBefore = useWorkoutStore.getState();

    const beforeExercise = stateBefore.workout?.workout_exercises[0].exercise;
    // Expect the exercise to be Bench Press
    expect(beforeExercise?.name).toBe("Bench Press");

    const exerciseIndex = 0;
    const replacementExercise: Exercise = {
      ...exercise,
      id: "2",
      guid: "Deadlift_-_Powerlifting",
      name: "Deadlift",
      primaryMuscles: ["Back"],
      secondaryMuscles: ["Glutes", "Hamstrings"],
    };
  
    replaceExerciseInWorkout(exerciseIndex, replacementExercise);
  
    const stateAfter = useWorkoutStore.getState();
    // Expect the exercise to be Deadlift now
    expect(stateAfter.workout?.workout_exercises[exerciseIndex].exercise.name).toBe("Deadlift");
    // And the length of the exercises to be 1
    expect(stateAfter.workout?.workout_exercises).toHaveLength(1);
  });
  
  it('should update notes for an exercise', () => {
    const { newWorkout, addExercisesToWorkout, updateNoteToExercise } = useWorkoutStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);
  
    const stateBefore = useWorkoutStore.getState();
    // Empty note
    expect(stateBefore.workout?.workout_exercises[0].notes).toBe("");
    const exerciseIndex = 0;
    const newNote = "Focus on proper form.";
  
    updateNoteToExercise(exerciseIndex, newNote);
  
    const stateAfter = useWorkoutStore.getState();
    // Expect the note to be updated
    expect(stateAfter.workout?.workout_exercises[exerciseIndex].notes).toBe(newNote);
  });
  
  it('should delete an exercise from the workout', () => {
    const { newWorkout, addExercisesToWorkout, deleteExercise } = useWorkoutStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);
  
    const stateBefore = useWorkoutStore.getState();
    expect(stateBefore.workout?.workout_exercises).toHaveLength(1);
  
    deleteExercise(0);
  
    const stateAfter = useWorkoutStore.getState();
    // Expect the exercises of the workout to be empty
    expect(stateAfter.workout?.workout_exercises).toHaveLength(0);
  });
  
  it('should reorder exercises in the workout', () => {
    const { newWorkout, addExercisesToWorkout, reorderExercises } = useWorkoutStore.getState();
    const secondExercise: Exercise = {
      ...exercise,
      id: "2",
      guid: "Squat_-_Powerlifting",
      name: "Squat",
      primaryMuscles: ["Legs"],
    };
  
    newWorkout('user123');
    addExercisesToWorkout([exercise, secondExercise]);
  
    const stateBefore = useWorkoutStore.getState();

    // Start with Bench Press and Squat
    expect(stateBefore.workout?.workout_exercises[0].exercise.name).toBe("Bench Press");
    expect(stateBefore.workout?.workout_exercises[1].exercise.name).toBe("Squat");
  
    const reorderedExercises = [
      stateBefore.workout!.workout_exercises[1],
      stateBefore.workout!.workout_exercises[0],
    ];
    reorderExercises(reorderedExercises);
  
    const stateAfter = useWorkoutStore.getState();
    // End with Squat and Bench Press
    expect(stateAfter.workout?.workout_exercises[0].exercise.name).toBe("Squat");
    expect(stateAfter.workout?.workout_exercises[1].exercise.name).toBe("Bench Press");
  });
  
  it('should set rest time for an exercise', () => {
    const { newWorkout, addExercisesToWorkout, setRestTimeToExercise } = useWorkoutStore.getState();
    newWorkout('user123');
    addExercisesToWorkout([exercise]);
  
    const stateBefore = useWorkoutStore.getState();

    // Expect the time to be empty
    expect(stateBefore.workout?.workout_exercises[0].setInterval).toBe(null);

    const exerciseIndex = 0;
    const restTime = 90;
    

    setRestTimeToExercise(exerciseIndex, restTime);
  
    const stateAfter = useWorkoutStore.getState();
    // Expect the time to be 90
    expect(stateAfter.workout?.workout_exercises[exerciseIndex].setInterval).toBe(90);
  });
  
  it('should initialize a workout from a routine', () => {
    const { startWorkoutFromRoutine, setRoutine } = useWorkoutStore.getState();
    const routine: Routine = {
      id: "routine1",
      userId: "user123",
      title: "Powerlifting Routine",
      date: dayjs(),
      duration: null,
      sets: 0,
      volume: 0,
      units: WeightUnit.KG,
      workout_exercises: [
        {
          id: "1",
          exercise,
          sets: [mockSet],
          notes: "",
          setInterval: 60,
        },
      ],
    };
  
    setRoutine(routine);
    startWorkoutFromRoutine(routine);
  
    const state = useWorkoutStore.getState();
    expect(state.workout).not.toBeNull();
    expect(state.workout?.routine?.id).toBe("routine1");
    expect(state.workout?.workout_exercises).toHaveLength(1);
    expect(state.workout?.workout_exercises[0].exercise.name).toBe("Bench Press");
    // Expect the mode to be WOROKOUT even though it was initialized from a routine..
    expect(state.storeMode).toBe(StoreMode.WORKOUT);
  });
  
  it('should empty the workout', () => {
    const { newWorkout, emptyWorkout } = useWorkoutStore.getState();
    newWorkout('user123');
  
    const stateBefore = useWorkoutStore.getState();
    expect(stateBefore.workout).not.toBeNull();
  
    emptyWorkout();
  
    const stateAfter = useWorkoutStore.getState();
    expect(stateAfter.workout).toBeNull();
  });
  
  it('should handle intensity conversion when user settings change', () => {
    const { newWorkout, addExercisesToWorkout, setIntensityToExerciseSet, convertAllWorkoutUnits } = useWorkoutStore.getState();
    const { setUser } = useUserStore.getState();
    setUser({
      ...useUserStore.getState().user!,
      intensitySetting: IntensityScale.RPE,
    });
    newWorkout('user123');
    addExercisesToWorkout([exercise]);
  
    const exerciseId = useWorkoutStore.getState().workout!.workout_exercises[0].id!;
    //Set the intensity to 8 RPE
    setIntensityToExerciseSet(exerciseId, 0, { scale: IntensityScale.RPE, value: 8 } as ExerciseSetIntensity);
    const beforeSet = useWorkoutStore.getState().workout?.workout_exercises[0].sets[0];
    expect(beforeSet?.intensity?.scale).toBe(IntensityScale.RPE);
    expect(beforeSet?.intensity?.value).toBe(8);

    // Change user intensity setting to RIR
    setUser({
      ...useUserStore.getState().user!,
      intensitySetting: IntensityScale.RIR,
    });
  
    convertAllWorkoutUnits();
  
    const updatedSet = useWorkoutStore.getState().workout?.workout_exercises[0].sets[0];

    // Expect the intensity to be converted
    expect(updatedSet?.intensity?.scale).toBe(IntensityScale.RIR);

    // 8 RPE is 2 RIR on this implementation
    expect(updatedSet?.intensity?.value).toBe(2);
  });

  it('should switch to EDIT_WORKOUT mode and edit the editingWorkout', () => {
    const { setStoreMode, setEditingWorkout, addExercisesToWorkout } = useWorkoutStore.getState();
  
    // Set up editingWorkout
    const mockEditingWorkout: Workout = {
      ...useWorkoutStore.getState().workout,
      id: "editworkout1",
      userId: "user123",
      workout_exercises: [],
      title: "Test Workout",
      date: dayjs(),
      duration: null,
      sets: 0,
      volume: 0,
      units: WeightUnit.KG,
    };
    setEditingWorkout(mockEditingWorkout);
    setStoreMode(StoreMode.EDIT_WORKOUT);
  
    // Add an exercise in edit workout mode
    addExercisesToWorkout([exercise]);
  
    const state = useWorkoutStore.getState();
    expect(state.storeMode).toBe(StoreMode.EDIT_WORKOUT);
    expect(state.editingWorkout?.workout_exercises).toHaveLength(1);
    expect(state.editingWorkout?.workout_exercises[0].exercise.name).toBe("Bench Press");
    expect(state.workout).toBeNull();
  });
  
  it('should switch to ROUTINE mode and edit the routine', () => {
    const { setStoreMode, setRoutine, addExercisesToWorkout } = useWorkoutStore.getState();
  
    // Set up routine
    const mockRoutine: Routine = {
      id: "routine1",
      userId: "user123",
      title: "Test Routine",
      date: dayjs(),
      duration: null,
      sets: 0,
      volume: 0,
      units: WeightUnit.KG,
      workout_exercises: [],
    };
    setRoutine(mockRoutine);
    setStoreMode(StoreMode.ROUTINE);
  
    // Add an exercise in routine mode
    addExercisesToWorkout([exercise]);
  
    const state = useWorkoutStore.getState();
    expect(state.storeMode).toBe(StoreMode.ROUTINE);
    expect(state.routine?.workout_exercises).toHaveLength(1);
    expect(state.routine?.workout_exercises[0].exercise.name).toBe("Bench Press");
    expect(state.workout).toBeNull();
  });
  
  it('should correctly modify workout when in WORKOUT mode', () => {
    const { newWorkout, addExercisesToWorkout, setStoreMode } = useWorkoutStore.getState();
  
    // Create a new workout and add an exercise
    newWorkout('user123');
    setStoreMode(StoreMode.WORKOUT);
    addExercisesToWorkout([exercise]);
  
    const state = useWorkoutStore.getState();
    expect(state.storeMode).toBe(StoreMode.WORKOUT);
    expect(state.workout?.workout_exercises).toHaveLength(1);
    expect(state.workout?.workout_exercises[0].exercise.name).toBe("Bench Press");
    expect(state.editingWorkout).toBeNull();
    expect(state.routine).toBeNull();
  });
  
});
