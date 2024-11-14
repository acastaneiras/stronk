import { Exercise } from "./Exercise";
import { ExerciseSet } from "./ExerciseSet";

export interface WorkoutExerciseType {
    id: string | number[];
    exercise: Exercise;
    sets: ExerciseSet[];
    setInterval: number | null;
    notes: string;
}