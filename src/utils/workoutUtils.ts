import { Exercise } from "@/models/Exercise";
import { SetCounts, Workout } from "../models/Workout";
import { SetWeight, WeightUnit } from "@/models/ExerciseSet";

export const getTotalSets = (workout: Workout | null): SetCounts => {
  if (!workout || !workout.workout_exercises) return {
    'done': 0,
    'total': 0
  };

  return {
    'done': workout.workout_exercises.reduce((totalSets, exercise) => totalSets + exercise.sets.filter((set) => set.completed).length, 0),
    'total': workout.workout_exercises.reduce((totalSets, exercise) => totalSets + exercise.sets.length, 0),
  };
}

export const getTotalVolume = (workout: Workout | null): number => {
  if (!workout || !workout.workout_exercises) return 0;

  let totalVolume = 0;
  for (const workoutExercise of workout.workout_exercises) {
    for (const set of workoutExercise.sets) {
      if (set.completed) {
        let newReps: number | string = 0;
        newReps = (typeof set.reps !== 'string' ? set.reps : 0);
        if (set.weight.value) {
          let weight: number | string = set.weight.value.toString().replace(',', '.');
          weight = isNaN(parseFloat(weight)) ? 0 : parseFloat(weight);
          totalVolume += weight * newReps;
        }
      }
    }
  }

  return totalVolume;
}

export const getWorkoutPercentage = (setsDetail: SetCounts): number => {
  if (setsDetail.total > 0) {
    return parseFloat(Number(setsDetail.done / setsDetail.total).toPrecision(2));
  }
  return 0
}

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Cardio': '#FF6347',
    'Olympic Weightlifting': '#FFa500',
    'Plyometrics': '#6B8E23',
    'Powerlifting': '#34255e',
    'Strength': '#1E90FF',
    'Stretching': '#5F9EA0',
    'Strongman': '#8B4513',
  };
  return colors[category] || '#808080';
}

export const formatWeightUnit = (unit: string): string => {
  return unit === 'kg' ? 'Kg' : 'Lb';
}

export const filterPrimaryAndSecondaryMuscles = (filteredData: Exercise[], muscleGroupFilter: string) => {
  return filteredData.sort((a: Exercise, b: Exercise) => {
    const aHasPrimary = a.primaryMuscles && a.primaryMuscles.includes(muscleGroupFilter);
    const bHasPrimary = b.primaryMuscles && b.primaryMuscles.includes(muscleGroupFilter);

    //If 'a' has the muscle group in primary muscles but 'b' doesn't, sort 'a' first
    if (aHasPrimary && !bHasPrimary) {
      return -1;
    }
    //If 'b' has the muscle group in primary muscles but 'a' doesn't, sort 'b' first
    else if (!aHasPrimary && bHasPrimary) {
      return 1;
    }
    //If both or neither have the muscle group in primary muscles, fall back to secondary muscles
    else {
      const aHasSecondary = a.secondaryMuscles && a.secondaryMuscles.includes(muscleGroupFilter);
      const bHasSecondary = b.secondaryMuscles && b.secondaryMuscles.includes(muscleGroupFilter);

      if (aHasSecondary && !bHasSecondary) {
        return -1;
      } else if (!aHasSecondary && bHasSecondary) {
        return 1;
      } else {
        return 0;
      }
    }
  })
}

export const WeightConvert = (setWeight: SetWeight, toUnit: WeightUnit): string => {
  const lbToKg = 0.45359237;
  const kgToLb = 2.20462262185;

  let convertedWeight: string;

  if (setWeight.value === "") {
    return "";
  }

  const numericValue = parseFloat(setWeight.value.toString());

  if (isNaN(numericValue)) {
    return "";
  }
  if (setWeight.unit === toUnit) {
    convertedWeight = numericValue.toString();
  } else if (setWeight.unit === WeightUnit.LB && toUnit === WeightUnit.KG) {
    convertedWeight = (numericValue * lbToKg).toString();
  } else if (setWeight.unit === WeightUnit.KG && toUnit === WeightUnit.LB) {
    convertedWeight = (numericValue * kgToLb).toString();
  } else {
    throw new Error("Unsupported unit conversion");
  }

  return convertedWeight;
};