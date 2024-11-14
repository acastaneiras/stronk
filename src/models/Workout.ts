import dayjs from "dayjs";
import { WorkoutExerciseType } from "./WorkoutExerciseType";

export interface Workout {
    id: string | null;
    user_id: string;
    title: string;
    description?: string;
    //routine: Routine | null; //TODO
    startDate: dayjs.Dayjs;
    endDate?: dayjs.Dayjs;
    duration: number | null;
    sets: number;
    volume: number;
    workout_exercises: WorkoutExerciseType[] | null;
    completed: boolean;
}

export interface SetCounts {
    done: number;
    total: number;
}