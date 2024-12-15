import WorkoutLayout from '@/layouts/WorkoutLayout';
import { Exercise } from '@/models/Exercise';
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';
import ExerciseList from '@/pages/training/ExerciseList';
import CreateNewWorkout from '@/pages/training/workout/CreateNewWorkout';
import { ExercisesState, useExercisesStore } from '@/stores/exerciseStore';
import { UserState, useUserStore } from '@/stores/userStore';
import { StoreMode, useWorkoutStore, WorkoutState } from '@/stores/workoutStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'fake-indexeddb/auto';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';


vi.mock('@uidotdev/usehooks', () => ({
  useMediaQuery: vi.fn().mockReturnValue(true), // Mocks isDesktop
}));

const mockExercise: Exercise = {
  id: "1",
  guid: "Dumbell_Bench_Press",
  name: "Dumbell Bench Press",
  category: "Strength",
  primaryMuscles: ["Chest"],
  secondaryMuscles: ["Triceps", "Shoulders"],
  equipment: "Dumbbell",
  instructions: ["Lie on a flat bench", "Grip the barbell with hands slightly wider than shoulder-width apart"],
  images: ["https://example.com/bench_press.jpg"],
  isCustom: false,
  createdAt: new Date(),
};

const mockExercise2: Exercise = {
  id: "2",
  guid: "Sumo_Deadlift",
  name: "Sumo Deadlift",
  category: "Powerlifting",
  primaryMuscles: ["hamstrings"],
  secondaryMuscles: ["adductors", "forearms", "glutes", "lower back", "middle back", "quadriceps", "traps"],
  equipment: "Barbell",
  instructions: ["Stand with feet wider than shoulder-width apart", "Grip the barbell with hands inside the legs"],
  images: ["https://example.com/deadlift.jpg"],
  isCustom: false,
  createdAt: new Date(),
};

describe('CreateNewWorkout and ExerciseList', () => {
  beforeEach(() => {

    useWorkoutStore.setState((state: Partial<WorkoutState>) => ({
      // Reset the state
      ...state,
      workout: null,
      editingWorkout: null,
      routine: null,
      exerciseSearchMode: ExerciseSearchMode.ADD_EXERCISE,
      selectedExerciseIndex: -1,
      storeMode: StoreMode.WORKOUT,
      isHydrated: false,
    }));

    useExercisesStore.setState((state: Partial<ExercisesState>) => ({
      // Reset the state
      ...state,
      allEquipment: ['Barbell', 'Dumbbell', 'Kettlebell', 'Machine', 'Bodyweight', 'Cable', 'Band', 'Medicine Ball', 'Bench', 'Box', 'None'],
      allExercises: [{ ...mockExercise }, { ...mockExercise2 }],
      allCategories: ['Strength', 'Powerlifting', 'Olympic Weightlifting', 'Cardio', 'Plyometrics'],
      allMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Lower Back', 'Upper Back', 'Chest', 'Shoulders', 'Triceps', 'Biceps', 'Forearms', 'Abs', 'Obliques'],
      isHydrated: false,
    }));

    useUserStore.setState((state: Partial<UserState>) => ({
      ...state,
      user: null,
      isUserSetupComplete: null,
    }));

    vi.resetAllMocks();
  });

  const renderWithRouterAndQueryClient = (initialRoute = '/training/create-new-workout') => {
    const queryClient = new QueryClient();
    const { newWorkout } = useWorkoutStore.getState();
    newWorkout('user123');
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route element={<WorkoutLayout />} >
              <Route path='/training/create-new-workout' element={<CreateNewWorkout />} />
            </Route>
            <Route path="/training/exercise-list" element={<ExerciseList />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('should add exercises from ExerciseList to CreateNewWorkout', async () => {
    const user = userEvent.setup();
    renderWithRouterAndQueryClient();

    // Ensure we are on the CreateNewWorkout page
    expect(screen.getByText('Ongoing Workout')).toBeInTheDocument();
    // Navigate to ExerciseList
    expect(screen.getByText(/No Exercises/i)).toBeInTheDocument();
    const addExerciseButton = screen.getByLabelText('add-workout-exercise');
    await user.click(addExerciseButton);

    // Check that ExerciseList is rendered
    await waitFor(() => {
      // We are on the ExerciseList page
      expect(screen.getByText('Exercise List')).toBeInTheDocument();
      expect(screen.getByText(/Add Exercise/i)).toBeInTheDocument();
    });

    // Check that we have 0 exercises in the workout
    expect(useWorkoutStore.getState().workout?.workout_exercises.length).toBe(0);

    // Select exercises
    const exercise1 = screen.getByText(/Dumbell Bench Press/i);
    const exercise2 = screen.getByText(/Sumo Deadlift/i);
    await user.click(exercise1);
    await user.click(exercise2);

    // Add exercises
    const confirmButton = screen.getByText(/Add 2 Exercises/i);
    await user.click(confirmButton);

    // Check that the exercises are added
    expect(useWorkoutStore.getState().workout?.workout_exercises.length).toBe(2);
    expect(useWorkoutStore.getState().workout?.workout_exercises[0].exercise.name).toMatch(/Dumbell Bench Press/i);
    expect(useWorkoutStore.getState().workout?.workout_exercises[1].exercise.name).toMatch(/Sumo Deadlift/i);

    // Going back to the ongoing workout
    await waitFor(() => {
      expect(screen.getByText('Dumbell Bench Press')).toBeInTheDocument();
      expect(screen.getByText('Sumo Deadlift')).toBeInTheDocument();
      expect(screen.getByText('Ongoing Workout')).toBeInTheDocument();
    });
  });

  it('should replace an exercise in CreateNewWorkout using ExerciseList', async () => {
    const user = userEvent.setup();
    renderWithRouterAndQueryClient();
    // From the ongoing workout
    expect(screen.getByText('Ongoing Workout')).toBeInTheDocument();
    const { addExercisesToWorkout } = useWorkoutStore.getState();

    // Check that we have 0 exercises in the workout
    expect(useWorkoutStore.getState().workout?.workout_exercises.length).toBe(0);

    // Add an exercise
    addExercisesToWorkout([{ ...mockExercise }]);

    // Check that we have 1 exercie in the workout
    await waitFor(() => {
      expect(screen.getByText('Dumbell Bench Press')).toBeInTheDocument();
      expect(useWorkoutStore.getState().workout?.workout_exercises.length).toBe(1);
    });

    // Exercise to replace
    const workoutExercise = useWorkoutStore.getState().workout?.workout_exercises[0];

    // Open the settings menu
    const settingsButton = screen.getByLabelText(`exercise-settings-${workoutExercise!.id}-${0}`);
    expect(settingsButton).toBeInTheDocument();

    // Open the menu
    await user.click(settingsButton);

    // Click on the Replace Exercise item
    const replaceItem = screen.getByLabelText(`exercise-replace-${workoutExercise!.id}-${0}`);
    expect(replaceItem).toBeInTheDocument();
    await user.click(replaceItem);

    //Check that we are on the ExerciseList page
    await waitFor(() => {
      expect(screen.getByText('Exercise List')).toBeInTheDocument();
      expect(screen.getByText('Replace Exercise')).toBeInTheDocument();
    });

    // Select the exercise we want now
    const newExercise = screen.getByText(/Deadlift/i);
    await user.click(newExercise);

    // Confirm
    const confirmButton = screen.getByText('Replace Exercise');
    await user.click(confirmButton);

    // Check that the exercise now changed from Bench -> Deadlift and that we are back on the Ongoing Workout page
    await waitFor(() => {
      expect(screen.getByText('Ongoing Workout')).toBeInTheDocument();
      expect(screen.getByText('Sumo Deadlift')).toBeInTheDocument();
    });
  });
});
