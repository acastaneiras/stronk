import dayjs from "dayjs";
import { WorkoutExerciseType } from "./WorkoutExerciseType";
import { WeightUnit } from "./ExerciseSet";

export interface Routine {
    id: string | null;
    userId: string;
    title: string;
    date: dayjs.Dayjs;
    duration: number | null;
    sets: number;
    volume: number;
    workout_exercises: WorkoutExerciseType[];
    units: WeightUnit
}

export interface Workout extends Routine {
    description?: string;
    routine?: Routine;
}

export interface SetCounts {
    done: number;
    total: number;
}