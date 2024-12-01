/* eslint-disable @typescript-eslint/no-explicit-any */
import { WeightUnit } from "@/models/ExerciseSet";
import { Workout } from "@/models/Workout";
import { WorkoutExerciseType } from "@/models/WorkoutExerciseType";
import { supabase } from "@/utils/supabaseClient";
import dayjs from "dayjs";

export const fetchWorkoutsWithExercises = async (userId: string | number): Promise<Workout[]> => {
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
  return data ? transformWorkoutData(data) : []; 
};



const transformWorkoutData = (data: any[]): Workout[] => {
  return data.map((rawWorkout) => ({
    id: rawWorkout.id,
    userId: rawWorkout.userId,
    title: rawWorkout.title,
    description: rawWorkout.description || "",
    date: dayjs(rawWorkout.date),
    duration: rawWorkout.duration || null,
    sets: rawWorkout.WorkoutExerciseDetails.reduce(
      (acc, detail) => acc + detail.ExerciseDetails.sets.length,
      0
    ),
    volume: rawWorkout.WorkoutExerciseDetails.reduce(
      (acc, detail) =>
        acc +
        detail.ExerciseDetails.sets.reduce(
          (setAcc, set) => setAcc + (parseFloat(set.weight.value || "0") * set.reps),
          0
        ),
      0
    ),
    workout_exercises: rawWorkout.WorkoutExerciseDetails.map((detail): WorkoutExerciseType => ({
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
        completed: set.completed,
        type: set.type,
        number: set.number,
      })),
      setInterval: detail.ExerciseDetails.setInterval || null,
      notes: detail.ExerciseDetails.notes || "",
    })),
  }));
};