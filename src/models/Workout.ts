import dayjs from "dayjs";
import { WorkoutExerciseType } from "./WorkoutExerciseType";

export interface Routine {
    id: string | null;
    userId: string;
    title: string;
    date: dayjs.Dayjs;
    duration: number | null;
    sets: number;
    volume: number;
    workout_exercises: WorkoutExerciseType[];
}

export interface Workout extends Routine {
    description?: string;
}

export interface SetCounts {
    done: number;
    total: number;
}