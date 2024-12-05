/* eslint-disable @typescript-eslint/no-explicit-any */
import { WeightUnit } from "@/models/ExerciseSet";
import { Routine, Workout } from "@/models/Workout";
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
  return data ? transformData(data, userUnits, 'WorkoutExerciseDetails') : [];
};

export const fetchRoutinesWithExercises = async (userId: string | number, userUnits: WeightUnit): Promise<Routine[]> => {
  const { data, error } = await supabase
    .from('Routines')
    .select(`
      id,
      title,
      userId,
      createdAt,
      RoutineExerciseDetails (
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
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching routines with exercises:', error);
    return [];
  }

  return data ? transformData(data, userUnits, 'RoutineExerciseDetails') : [];
};


//Function that parses the data from the database into the Workout or Routine model
const transformData = ( data: any[], userUnits: WeightUnit, detailsKey: 'WorkoutExerciseDetails' | 'RoutineExerciseDetails'): Routine[] | Workout[] => {
  return data.map((rawItem) => ({
    id: rawItem.id,
    userId: rawItem.userId,
    title: rawItem.title,
    description: rawItem.description || "",
    date: dayjs(rawItem.date),
    duration: rawItem.duration || null,
    sets: rawItem[detailsKey].reduce(
      (acc: any, detail: { ExerciseDetails: { sets: string | any[]; }; }) => acc + detail.ExerciseDetails.sets.length,
      0
    ),
    volume: rawItem[detailsKey].reduce(
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
    workout_exercises: rawItem[detailsKey].map((detail: { ExerciseDetails: { id: any; Exercises: { id: any; name: any; guid: any; instructions: any; images: any; isCustom: any; category: any; equipment: any; primaryMuscles: any; secondaryMuscles: any; createdAt: Date | null; }; sets: any[]; setInterval: any; notes: any; }; }): WorkoutExerciseType => ({
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
          ? detail.ExerciseDetails.Exercises.createdAt
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