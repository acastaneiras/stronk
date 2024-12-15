import WorkoutLayout from '@/layouts/WorkoutLayout';
import { Exercise } from '@/models/Exercise';
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';
import TrainingHome from '@/pages/training/TrainingHome';
import CreateNewWorkout from '@/pages/training/workout/CreateNewWorkout';
import { StoreMode, useWorkoutStore, WorkoutState } from '@/stores/workoutStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'fake-indexeddb/auto';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

vi.mock('@uidotdev/usehooks', () => ({
  useMediaQuery: vi.fn().mockReturnValue(true), // Mocks isDesktop
}));

const renderComponent = (initialRoute = '/training/create-new-workout') => {
  const queryClient = new QueryClient();
  const { newWorkout } = useWorkoutStore.getState();
  newWorkout('user123');
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path='/training' element={<TrainingHome />} />
          <Route element={<WorkoutLayout />} >
            <Route path='/training/create-new-workout' element={<CreateNewWorkout />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('CreateNewWorkout - Complete Workout', () => {
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
    vi.resetAllMocks();
  });

  it('should prevent workout completion if no sets are completed', async () => {
    renderComponent();
    const user = userEvent.setup();

    // Try to finish the workout
    const finishButton = screen.getByText(/Finish/i);
    await user.click(finishButton);

    // Check that the error message is shown
    await waitFor(() => {
      expect(screen.getByText(/It appears you have some incomplete sets, please complete those sets before finishing the workout./i)).toBeInTheDocument();
    });
  });

  it('should allow workout completion if at least one set is completed', async () => {
    const { addExercisesToWorkout, toggleSetCompletion } = useWorkoutStore.getState();

    renderComponent();
    const user = userEvent.setup();

    // Check that we have 0 workout exercises
    expect(useWorkoutStore.getState().workout?.workout_exercises.length).toBe(0);

    addExercisesToWorkout([{ ...mockExercise }]);

    expect(useWorkoutStore.getState().workout?.workout_exercises.length).toBe(1);

    // Completing
    toggleSetCompletion(useWorkoutStore.getState().workout!.workout_exercises[0].id.toString(), 0);

    // Try to finish
    const finishButton = screen.getByText(/Finish/i);
    await user.click(finishButton);

    // Check finish modal opens
    await waitFor(() => {
      expect(screen.getByText(/Summary/i)).toBeInTheDocument();
    });
  });

  it('should display the "No Exercises" message if there are no exercises in the workout', () => {
    renderComponent();
    // Check that No exercises message is shown
    expect(screen.getByText(/No Exercises/i)).toBeInTheDocument();
  });
});
