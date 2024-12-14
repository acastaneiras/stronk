import { Exercise } from '@/models/Exercise';
import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

type WorkoutExerciseProps = {
  id: number;
  currentExercise: WorkoutExerciseType;
  isViewing?: boolean;
  onChangeSetTypePress: (exerciseId: string | number[], index: number) => void;
  onCallExerciseNotes: () => void;
  onCallRemoveExercise: () => void;
  onCallRestTimeExercise: () => void;
  onCallShowIntensityModal: (exerciseId: string | number[], index: number) => void;
};

const exercise: Exercise = {
  id: "1",
  guid: "Bench_Press",
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
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // useNavigate mock
  };
});

describe('WorkoutExercise', () => {
  it('should render an exercise', () => {
    const props: WorkoutExerciseProps = {
      id: 1,
      currentExercise: {
        id: "1",
        exercise: {...exercise},
        sets: [],
        notes: '',
        setInterval: 0,
      },
      onChangeSetTypePress: () => {},
      onCallExerciseNotes: () => {},
      onCallRemoveExercise: () => {},
      onCallRestTimeExercise: () => {},
      onCallShowIntensityModal: () => {},
    };

    render(
      <MemoryRouter>
        <WorkoutExercise {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bench Press/i)).toBeInTheDocument(); // Checks title
    expect(screen.getByText(/Chest/i)).toBeInTheDocument(); // Checks primary muscle
  });

  it('should render an exercise with notes', () => {
    const props: WorkoutExerciseProps = {
      id: 1,
      currentExercise: {
        id: "1",
        exercise: {...exercise},
        sets: [],
        notes: 'Shoulder pain... be careful',
        setInterval: 0,
      },
      onChangeSetTypePress: () => {},
      onCallExerciseNotes: () => {},
      onCallRemoveExercise: () => {},
      onCallRestTimeExercise: () => {},
      onCallShowIntensityModal: () => {},
    };

    render(
      <MemoryRouter>
        <WorkoutExercise {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Shoulder pain... be careful/i)).toBeInTheDocument(); // Checks notes
  });

  it('should render an exercise with rest time', () => {
    const props: WorkoutExerciseProps = {
      id: 1,
      currentExercise: {
        id: "1",
        exercise: {...exercise},
        sets: [],
        notes: '',
        setInterval: 68,
      },
      onChangeSetTypePress: () => {},
      onCallExerciseNotes: () => {},
      onCallRemoveExercise: () => {},
      onCallRestTimeExercise: () => {},
      onCallShowIntensityModal: () => {},
    };

    render(
      <MemoryRouter>
        <WorkoutExercise {...props} />
      </MemoryRouter>
    );

    expect(screen.getByText(/1:08/i)).toBeInTheDocument();
  });
});