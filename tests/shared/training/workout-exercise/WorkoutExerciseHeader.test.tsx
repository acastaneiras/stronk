import { Exercise } from '@/models/Exercise';
import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExerciseHeader from '@/shared/training/workout-exercise/WorkoutExerciseHeader';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
  };
});

const mockSetExerciseSearchMode = vi.fn();
const mockSetSelectedExerciseIndex = vi.fn();

// Mock the workoutStore
vi.mock('@/stores/workoutStore', () => ({
  useWorkoutStore: () => ({
    setExerciseSearchMode: mockSetExerciseSearchMode,
    setSelectedExerciseIndex: mockSetSelectedExerciseIndex,
  }),
}));
describe('WorkoutExerciseHeader', () => {
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

  const currentExercise: WorkoutExerciseType = {
    id: "1",
    exercise: exercise,
    sets: [],
    notes: 'Shoulder pain... be careful',
    setInterval: 60,
  };

  const defaultProps = {
    index: 1,
    currentExercise: currentExercise,
    isViewing: false,
    onCallRemoveExercise: vi.fn(),
    onCallExerciseNotes: vi.fn(),
    onCallRestTimeExercise: vi.fn(),
  };

  const renderComponent = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <WorkoutExerciseHeader {...props} />
      </MemoryRouter>
    );
  };

  it('renders exercise name', () => {
    renderComponent();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
  });

  it('renders category tag with color', () => {
    renderComponent();
    const categoryBadge = screen.getByText('Strength');
    expect(categoryBadge).toBeInTheDocument();
    expect(categoryBadge).toHaveStyle(`background-color: rgb(30, 144, 255)`); // Strength color
  });

  it('renders primary muscle name', () => {
    renderComponent();
    expect(screen.getByText('Chest')).toBeInTheDocument();
  });

  it('renders and toggles notes with “Show more”/"Show less', () => {

    const longNote = 'test'.repeat(100);
    renderComponent({ ...defaultProps, currentExercise: { ...currentExercise, notes: longNote } });

    // Initially show truncated text and "Show More" button
    const truncatedText = `${longNote.slice(0, 80)}...`;
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(screen.getByText('Show More')).toBeInTheDocument();

    // Click "Show More"
    fireEvent.click(screen.getByText('Show More'));
    expect(screen.getByText(longNote)).toBeInTheDocument();
    expect(screen.getByText('Show Less')).toBeInTheDocument();

    // Click "Show Less"
    fireEvent.click(screen.getByText('Show Less'));
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(screen.getByText('Show More')).toBeInTheDocument();
  });

  it('renders exercise image', () => {
    renderComponent();
    const img = screen.getByAltText('Exercise') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(`${import.meta.env.VITE_EXERCISE_PICTURES_URL}${exercise.images![0]}`);
  });

  it('renders the icon image when the exercise image fails to load', async () => {
    renderComponent();
    const img = screen.getByAltText('Exercise') as HTMLImageElement;
    // Simulate image not loading so that the error event is triggered
    fireEvent.error(img);

    //Wait for the image icon to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('image-icon')).toBeInTheDocument();
    });
  });

  it('doesn\'t render the context menu when isViewing is true', () => {
    renderComponent({ ...defaultProps, isViewing: true });
    expect(screen.queryByLabelText(`exercise-settings-${exercise.id}-${defaultProps.index}`)).not.toBeInTheDocument();
  });

  it('displays the dropdown menu on settings button click', async () => {
    const user = userEvent.setup();
    renderComponent();
    const settingsButton = screen.getByLabelText(`exercise-settings-${exercise.id}-${defaultProps.index}`);
    expect(settingsButton).toBeInTheDocument();

    // Open the menu
    await user.click(settingsButton);

    // Check menu items
    expect(screen.getByLabelText(`exercise-notes-${exercise.id}-${defaultProps.index}`)).toBeInTheDocument();
    expect(screen.getByLabelText(`exercise-rest-${exercise.id}-${defaultProps.index}`)).toBeInTheDocument();
    expect(screen.getByLabelText(`exercise-replace-${exercise.id}-${defaultProps.index}`)).toBeInTheDocument();
    expect(screen.getByLabelText(`exercise-remove-${exercise.id}-${defaultProps.index}`)).toBeInTheDocument();
  });

  it('calls onCallExerciseNotes when clicking Notes', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Open the menu
    const settingsButton = screen.getByLabelText(`exercise-settings-${exercise.id}-${defaultProps.index}`);
    await user.click(settingsButton);

    // Click on the Notes item
    const notesItem = screen.getByLabelText(`exercise-notes-${exercise.id}-${defaultProps.index}`);
    await user.click(notesItem);

    expect(defaultProps.onCallExerciseNotes).toHaveBeenCalled();
  });

  it('calls onCallRestTimeExercise when clicking Rest time', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Open the menu
    const settingsButton = screen.getByLabelText(`exercise-settings-${exercise.id}-${defaultProps.index}`);
    await user.click(settingsButton);

    // Click on the Rest Time item
    const restItem = screen.getByLabelText(`exercise-rest-${exercise.id}-${defaultProps.index}`);
    await user.click(restItem);

    expect(defaultProps.onCallRestTimeExercise).toHaveBeenCalled();
  });

  it('calls mockSetExerciseSearchMode and navigates when clicking Replace exercise', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Open the menu
    const settingsButton = screen.getByLabelText(`exercise-settings-${exercise.id}-${defaultProps.index}`);
    expect(settingsButton).toBeInTheDocument();
    await user.click(settingsButton);

    // Click on the Replace item
    const replaceItem = screen.getByLabelText(`exercise-replace-${exercise.id}-${defaultProps.index}`);
    expect(replaceItem).toBeInTheDocument(); 

    await user.click(replaceItem);

    // Check that the store was updated and the navigation was called
    expect(mockSetExerciseSearchMode).toHaveBeenCalledWith(ExerciseSearchMode.REPLACE_EXERCISE);
    // Ensure that the store really was called with the correct mode
    expect(mockSetExerciseSearchMode).not.toHaveBeenCalledWith(ExerciseSearchMode.ADD_EXERCISE);

    expect(mockSetSelectedExerciseIndex).toHaveBeenCalledWith(defaultProps.index);
    expect(mockedUseNavigate).toHaveBeenCalledWith('/training/exercise-list');
  });

  it('calls onCallRemoveExercise when clicking Remove exercise', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Open the menu
    const settingsButton = screen.getByLabelText(`exercise-settings-${exercise.id}-${defaultProps.index}`);
    await user.click(settingsButton);

    // Click on the Remove item
    const removeItem = screen.getByLabelText(`exercise-remove-${exercise.id}-${defaultProps.index}`);
    await user.click(removeItem);

    expect(defaultProps.onCallRemoveExercise).toHaveBeenCalled();
  });

});
