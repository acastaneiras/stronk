/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExerciseSet, WeightUnit } from "@/models/ExerciseSet";
import { Routine, Workout } from "@/models/Workout";
import { WorkoutExerciseType } from "@/models/WorkoutExerciseType";
import dayjs from "dayjs";
import { WeightConvert } from "./workoutUtils";

type DbDetail = { ExerciseDetails: { id: any; Exercises: { id: any; name: any; guid: any; instructions: any; images: any; isCustom: any; category: any; equipment: any; primaryMuscles: any; secondaryMuscles: any; createdAt: Date | null; }; sets: any[]; setInterval: any; notes: any; order: number }; }

//Function that parses the data from the database into the Workout or Routine model
export const parseWorkoutData = ( data: any[], userUnits: WeightUnit, detailsKey: 'WorkoutExerciseDetails' | 'RoutineExerciseDetails'): Routine[] | Workout[] => {
  return data.map((rawItem) => ({
    id: rawItem.id,
    units: userUnits,
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
            WeightConvert(set.weight, userUnits) ?? 0
          );
          return setAcc + (convertedWeight * set.reps);
        }, 0),
      0
    ),
    workout_exercises: [...rawItem[detailsKey]]
    .sort((a:DbDetail, b: DbDetail) => a.ExerciseDetails.order - b.ExerciseDetails.order)
    .map((detail: DbDetail): WorkoutExerciseType => ({
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
      sets: detail.ExerciseDetails.sets.map((set: ExerciseSet) => {
        const originalWeightValue = set.weight?.value ?? "";
        
        const weightValue = originalWeightValue === "" || originalWeightValue === null || originalWeightValue === 0
          ? 0
          : parseFloat(WeightConvert({ ...set.weight, value: originalWeightValue }, userUnits) ?? 0); 
        
        if (isNaN(weightValue)) {
          console.warn("Unexpected NaN value in weight conversion", {
            originalWeight: set.weight,
            userUnits,
          });
        }
        return {
          id: set.id,
          reps: set.reps,
          weight: {
            unit: userUnits,
            value: weightValue,
          },
          type: set.type,
          intensity: set.intensity,
          number: set.number,
          completed: set.completed,
        };
      }),
      setInterval: detail.ExerciseDetails.setInterval || null,
      notes: detail.ExerciseDetails.notes || "",
    })),
  }));
};