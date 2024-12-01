import dayjs from "dayjs";
import { WorkoutExerciseType } from "./WorkoutExerciseType";

export interface Workout {
    id: string | null;
    userId: string;
    title: string;
    description?: string;
    //routine: Routine | null; //TODO
    date: dayjs.Dayjs;
    duration: number | null;
    sets: number;
    volume: number;
    workout_exercises: WorkoutExerciseType[];
}

export interface SetCounts {
    done: number;
    total: number;
}