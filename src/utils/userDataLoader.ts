/* eslint-disable @typescript-eslint/no-explicit-any */
import { WeightUnit } from "@/models/ExerciseSet";
import { Workout } from "@/models/Workout";
import { WorkoutExerciseType } from "@/models/WorkoutExerciseType";
import { supabase } from "@/utils/supabaseClient";
import dayjs from "dayjs";
import { WeightConvert } from "./workoutUtils";

export const fetchWorkoutsWithExercises = async (userId: string | number, userUnits: WeightUnit): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('Workouts')
    .select(`
      id,
      title,
      description,
      date,
      duration,
      userId,
      WorkoutExerciseDetails (
        ExerciseDetails (
          id,
          notes,
          sets,
          setInterval,
          Exercises (
            *
          )
        )
      )
    `)
    .eq('userId', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching workouts with exercises:', error);
    return [];
  }
  return data ? transformWorkoutData(data, userUnits) : []; 
};



const transformWorkoutData = (data: any[], userUnits: WeightUnit): Workout[] => {
  return data.map((rawWorkout) => ({
    id: rawWorkout.id,
    userId: rawWorkout.userId,
    title: rawWorkout.title,
    description: rawWorkout.description || "",
    date: dayjs(rawWorkout.date),
    duration: rawWorkout.duration || null,
    sets: rawWorkout.WorkoutExerciseDetails.reduce(
      (acc: any, detail: { ExerciseDetails: { sets: string | any[]; }; }) => acc + detail.ExerciseDetails.sets.length,
      0
    ),
    volume: rawWorkout.WorkoutExerciseDetails.reduce(
      (acc: any, detail: { ExerciseDetails: { sets: any[]; }; }) =>
        acc +
        detail.ExerciseDetails.sets.reduce((setAcc, set) => {
          const convertedWeight = parseFloat(
            WeightConvert(set.weight, userUnits)
          );
          return setAcc + (convertedWeight * set.reps);
        }, 0),
      0
    ),
    workout_exercises: rawWorkout.WorkoutExerciseDetails.map((detail: { ExerciseDetails: { id: any; Exercises: { id: any; name: any; guid: any; instructions: any; images: any; isCustom: any; category: any; equipment: any; primaryMuscles: any; secondaryMuscles: any; createdAt: Date | null; }; sets: any[]; setInterval: any; notes: any; }; }): WorkoutExerciseType => ({
      id: detail.ExerciseDetails.id,
      exercise: {
        id: detail.ExerciseDetails.Exercises.id,
        name: detail.ExerciseDetails.Exercises.name,
        guid: detail.ExerciseDetails.Exercises.guid,
        instructions: detail.ExerciseDetails.Exercises.instructions,
        images: detail.ExerciseDetails.Exercises.images,
        isCustom: detail.ExerciseDetails.Exercises.isCustom,
        category: detail.ExerciseDetails.Exercises.category,
        equipment: detail.ExerciseDetails.Exercises.equipment,
        primaryMuscles: detail.ExerciseDetails.Exercises.primaryMuscles || [],
        secondaryMuscles: detail.ExerciseDetails.Exercises.secondaryMuscles || [],
        createdAt: detail.ExerciseDetails.Exercises.createdAt
          ? (detail.ExerciseDetails.Exercises.createdAt)
          : null,
      },
      sets: detail.ExerciseDetails.sets.map((set) => ({
        id: set.id,
        reps: set.reps,
        weight: {
          unit: set.weight.unit as WeightUnit,
          value: parseFloat(set.weight.value),
        },
        type: set.type,
        intensity: set.intensity,
        number: set.number,
        completed: set.completed,
      })),
      setInterval: detail.ExerciseDetails.setInterval || null,
      notes: detail.ExerciseDetails.notes || "",
    })),
  }));
};