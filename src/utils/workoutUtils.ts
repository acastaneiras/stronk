import { Exercise } from "@/models/Exercise";
import { ExerciseSet, SetWeight, WeightUnit } from "@/models/ExerciseSet";
import dayjs from "dayjs";
import { SetCounts, Workout } from "../models/Workout";

//Get the total sets of a workout
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

//Get the total volume of a workout
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

//Get the percentage of a workout that has been completed
export const getWorkoutPercentage = (setsDetail: SetCounts): number => {
  if (setsDetail.total > 0) {
    return parseFloat(Number(setsDetail.done / setsDetail.total).toPrecision(2));
  }
  return 0
}

//Get the color of a category
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

//Filter exercises by muscle group
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

//Convert the weight of a set to a different unit
export const WeightConvert = (setWeight: SetWeight, toUnit: WeightUnit): string => {
  const lbToKg = 0.45359237;
  const kgToLb = 2.20462262185;

  if (setWeight.value === "") {
    return "";
  }

  const numericValue = parseFloat(setWeight.value.toString());

  if (isNaN(numericValue)) {
    return "";
  }

  let convertedWeight: number;

  if (setWeight.unit === toUnit) {
    convertedWeight = numericValue;
  } else if (setWeight.unit === WeightUnit.LB && toUnit === WeightUnit.KG) {
    convertedWeight = numericValue * lbToKg;
  } else if (setWeight.unit === WeightUnit.KG && toUnit === WeightUnit.LB) {
    convertedWeight = numericValue * kgToLb;
  } else {
    throw new Error("Unsupported unit conversion");
  }

  return formatWeightDecimals(convertedWeight);
};

export const formatWeightDecimals = (weight: number): string => {
  return weight % 1 === 0 ? weight.toFixed(0) : weight.toFixed(2);
}

//Format the time in hours, minutes and seconds
export const formatTime = (time: number) => {
  if (time === 0) {
    return "0s";
  }
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  let timeString = "";

  if (hours > 0) {
    timeString += `${hours}h`;
  }
  if (minutes > 0) {
    timeString += ` ${minutes}m`;
  }
  if (seconds > 0) {
    timeString += `${seconds.toFixed(0)}s`;
  }

  return timeString;
};

//Calculate the average time of a user's workouts
export const getAllWorkoutsAverageTime = (workouts: Workout[]): number => {
  if (workouts.length === 0) {
    return 0;
  }

  const totalDuration = workouts.reduce((acc, workout) => acc + (workout.duration || 0), 0);
  return totalDuration / workouts.length;
}

//Calculate the total volume of a user's workouts in the last week
export const getUserWeeklyVolume = (workouts: Workout[], userUnits: WeightUnit): number => {
  const weekAgo = dayjs().subtract(7, 'day');
  const weeklyWorkouts = workouts.filter((workout) => dayjs(workout.date).isAfter(weekAgo));

  let totalVolume = 0;
  for (const workout of weeklyWorkouts) {
    for (const workoutExercise of workout.workout_exercises) {
      for (const set of workoutExercise.sets) {
        let newReps: number | string = 0;
        newReps = (typeof set.reps !== 'string' ? set.reps : 0);
        if (set.weight.value) {
          let weight: number | string = set.weight.value.toString().replace(',', '.');
          weight = isNaN(parseFloat(weight)) ? 0 : parseFloat(weight);
          totalVolume += parseFloat(WeightConvert(set.weight, userUnits)) * newReps;
        }
      }
    }
  }

  return parseFloat(totalVolume.toFixed(2));
}

//Returns the user's last exercise PR with the {date, weight,  reps} format
export const getUserLastExercisePR = (workouts: Workout[], userUnits: WeightUnit): { date: dayjs.Dayjs, exercise: Exercise, set: ExerciseSet } | null => {
  const exercisePRs: Record<string, { date: dayjs.Dayjs, set: ExerciseSet }> = {};

  for (const workout of workouts) {
    for (const workoutExercise of workout.workout_exercises) {
      const { exercise, sets } = workoutExercise;

      for (const set of sets) {
        set.reps = parseInt(set.reps.toString());
        set.weight.value = parseFloat(set.weight.value.toString());
        const setWeight = parseFloat(WeightConvert(set.weight, userUnits));
        const totalWeight = setWeight * set.reps;

        if (!exercisePRs[exercise.id] || totalWeight > (parseFloat(exercisePRs[exercise.id].set.weight.value.toString()) * parseInt(exercisePRs[exercise.id].set.reps.toString()))) {
          //If the current set is a PR, update the PR
          exercisePRs[exercise.id] = {
            date: workout.date,
            set: { ...set, weight: { ...set.weight, unit: userUnits, value: parseFloat(setWeight.toFixed(2)) } }
          };
        }
      }
    }
  }

  //Find the last PR
  let lastPR: { date: dayjs.Dayjs, exercise: Exercise, set: ExerciseSet } | null = null;

  for (const [exerciseId, pr] of Object.entries(exercisePRs)) {
    if (!lastPR || pr.date.isAfter(lastPR.date)) {
      const exercise = workouts
        .flatMap(workout => workout.workout_exercises)
        .find(workoutExercise => workoutExercise.exercise.id === exerciseId)?.exercise;

      if (exercise) {
        lastPR = { date: pr.date, exercise, set: pr.set };
      }
    }
  }

  return lastPR;
};

//Calculate the elapsed time from a date (in seconds)
export const calculateElapsedSecondsFromDate = (date: dayjs.Dayjs): number => {
  const now = dayjs();
  const diff = now.diff(date, 'second');

  return (diff);
}