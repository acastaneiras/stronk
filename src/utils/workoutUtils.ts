import { SetCounts, Workout } from "../models/Workout";

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
  return unit === 'kilograms' ? 'Kg' : 'Lb';
}