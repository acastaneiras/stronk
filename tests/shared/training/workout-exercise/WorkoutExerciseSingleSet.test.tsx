import { Exercise } from '@/models/Exercise';
import { ExerciseSet, IntensityScale, SetType, WeightUnit } from '@/models/ExerciseSet';
import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExerciseSingleSet from '@/shared/training/workout-exercise/WorkoutExerciseSingleSet';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockToggleSetCompletion = vi.fn();
const mockDeleteSetToExercise = vi.fn();

vi.mock('@/stores/workoutStore', () => ({
  useWorkoutStore: () => ({
    toggleSetCompletion: mockToggleSetCompletion,
    deleteSetToExercise: mockDeleteSetToExercise,
    storeMode: 'ADD_WORKOUT',
  }),
  StoreMode: {
    WORKOUT: 'ADD_WORKOUT',
    ROUTINE: 'ROUTINE',
    EDIT_WORKOUT: 'EDIT_WORKOUT',
  },
}));

vi.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    user: {
      intensitySetting: IntensityScale.RPE,
    },
  }),
}));

vi.mock('@uidotdev/usehooks', () => ({
  useMediaQuery: vi.fn().mockReturnValue(true), // Mocks isDesktop
}));

describe('WorkoutExerciseSingleSet', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

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
  }

  const mockCurrentExercise: WorkoutExerciseType = {
    id: 'exercise-1',
    exercise: exercise,
    sets: [mockSet],
    notes: '',
    setInterval: 60,
  };

  const mockProps = {
    set: mockSet,
    setIndex: 0,
    currentExercise: mockCurrentExercise,
    callShowIntensityModal: vi.fn(),
    onChangeSetType: vi.fn(),
  };

  const renderComponent = (props = mockProps) => render(<WorkoutExerciseSingleSet {...props} />);

  it('renders set details', () => {
    renderComponent();

    // Check for weight input
    expect(screen.getByDisplayValue('50')).toBeInTheDocument();

    // Check for reps input
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();

    // Check for intensity button
    expect(screen.getByText('@ 8.0')).toBeInTheDocument();

    // Check for complete set button
    expect(screen.getByLabelText(`complete-set-${mockCurrentExercise.id}-${mockCurrentExercise.sets[0].id}`)).toBeInTheDocument();
  });

  it('calls toggleSetCompletion when completing a set', async () => {
    const user = userEvent.setup();
    renderComponent();

    const completeButton = screen.getByLabelText(`complete-set-${mockCurrentExercise.id}-${mockCurrentExercise.sets[0].id}`);
    await user.click(completeButton);

    expect(mockToggleSetCompletion).toHaveBeenCalledWith(mockCurrentExercise.id, mockProps.setIndex);
  });

  it('calls deleteSetToExercise on swipe delete', async () => {
    renderComponent();
    // Swipe anything inside the container in order to show the delete button
    const intensityButton = screen.getByText('@ 8.0');
    fireEvent.dragEnd(intensityButton, {
      offset: { x: -200, y: 0 },
    });
    // Delete button should appear after swipe
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();

    // Simulate delete button click
    fireEvent.click(deleteButton);

    expect(mockDeleteSetToExercise).toHaveBeenCalledWith(mockCurrentExercise.id, mockProps.setIndex);
  });

  it('calls callShowIntensityModal when clicking intensity button', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Click intensity button
    const intensityButton = screen.getByText('@ 8.0');
    await user.click(intensityButton);

    expect(mockProps.callShowIntensityModal).toHaveBeenCalledWith(mockProps.setIndex);
  });

  it('calls onChangeSetType when changing set type', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Click change type
    const changeTypeButton = screen.getByLabelText(`set-type-${mockCurrentExercise.id}-${mockCurrentExercise.sets[0].id}`)
    await user.click(changeTypeButton);

    expect(mockProps.onChangeSetType).toHaveBeenCalled();
  });

  it('renders correctly when the set is completed', () => {
    renderComponent({
      ...mockProps,
      set: { ...mockSet, completed: true },
    });
    
    const completeButton = screen.getByLabelText(`complete-set-${mockCurrentExercise.id}-${mockCurrentExercise.sets[0].id}`)
    // Check the button is with the proper style
    expect(completeButton).toHaveClass('bg-primary');
  });
});
