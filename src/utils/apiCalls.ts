import { User } from "@/models/User";
import { Routine, SetCounts, Workout } from "@/models/Workout";
import { WorkoutExerciseType } from "@/models/WorkoutExerciseType";
import { supabase } from "./supabaseClient";

export const editRoutine = async (routine: Routine, fetchedRoutine: Routine) => {
  const routineId = routine.id;

  const { error: routineError } = await supabase
    .from('Routines')
    .update({
      title: routine.title,
    })
    .eq('id', routineId)
    .select();

  if (routineError) {
    throw new Error('Error saving routine, please try again.');
  }

  const routineExercises = routine?.workout_exercises;
  if (routineExercises) {
    const exerciseDetailsData = routineExercises.map((exerciseDetail: WorkoutExerciseType, index: number) => ({
      id: exerciseDetail.id,
      notes: exerciseDetail.notes,
      setInterval: exerciseDetail.setInterval,
      order: index,
      exerciseId: exerciseDetail.exercise.id,
      sets: exerciseDetail.sets,
    }));

    const { data: exerciseDetailsResponse, error: exerciseDetailsError } = await supabase
      .from('ExerciseDetails')
      .upsert(exerciseDetailsData)
      .select();

    if (exerciseDetailsError) {
      throw new Error('Error saving exercises, please try again.');
    }

    const routineExerciseDetailsData = exerciseDetailsResponse.map((exerciseDetail) => ({
      routineId,
      exerciseDetailsId: exerciseDetail.id,
    }));

    const { error: routineExerciseDetailsError } = await supabase
      .from('RoutineExerciseDetails')
      .upsert(routineExerciseDetailsData);

    if (routineExerciseDetailsError) {
      throw new Error('Error linking exercises to routine, please try again.');
    }
    //Find deleted exercises from routine
    const originalExercises = fetchedRoutine!.workout_exercises || [];
    const currentExercises = routine!.workout_exercises || [];

    const deletedExercises = originalExercises.filter((originalExercise) => !currentExercises.some((currentExercise) => currentExercise.id === originalExercise.id));
    const deletedExerciseIds = deletedExercises.map((exercise) => exercise.id);

    if (deletedExerciseIds.length > 0) {
      const { error: exerciseError } = await supabase
        .from('ExerciseDetails')
        .delete()
        .in('id', deletedExerciseIds).select();
      if (exerciseError) {
        throw new Error('Error deleting exercises, please try again.');
      }
    }
  }
}

export const createRoutine = async (routine: Routine, user: User) => {
  const { data: routineDataResponse, error: routineErr } = await supabase
    .from('Routines')
    .insert([{
      title: routine.title,
      userId: user?.id,
    }])
    .select();
  if (routineErr) {
    throw new Error('Error saving workout, please try again.');
  }

  const routineId = routineDataResponse[0].id;

  const routineExercises = routine?.workout_exercises;
  if (routineExercises) {
    const exerciseDetailsData = routineExercises.map((exercise, index) => ({
      notes: exercise.notes,
      setInterval: exercise.setInterval,
      order: index,
      exerciseId: exercise.exercise.id,
      sets: exercise.sets,
    }));

    const { data: routineDetailsResponse, error: routineDetailsError } = await supabase
      .from('ExerciseDetails')
      .insert(exerciseDetailsData)
      .select();

    if (routineDetailsError) {
      throw new Error('Error saving exercises, please try again.');
    }

    const routineExerciseDetailsData = routineDetailsResponse.map((exerciseDetail) => ({
      routineId,
      exerciseDetailsId: exerciseDetail.id,
    }));

    const { error: routineExerciseDetailsError } = await supabase
      .from('RoutineExerciseDetails')
      .insert(routineExerciseDetailsData);

    if (routineExerciseDetailsError) {
      throw new Error('Error linking exercises to routine, please try again.');
    }
  }
}

export const createWorkout = async (workout: Workout, workoutTitle: string, workoutDescription: string, workoutDuration: number, setsDetail: SetCounts, totalVolume: number, user: User) => {
  const { data: workoutDataResponse, error: workoutError } = await supabase
    .from('Workouts')
    .insert([{
      title: workoutTitle,
      description: workoutDescription,
      date: workout?.date,
      duration: workoutDuration,
      sets: setsDetail.done,
      volume: totalVolume,
      units: user?.unitPreference,
      userId: user?.id,
    }])
    .select();

  if (workoutError) {
    throw new Error('Error saving workout, please try again.');
  }

  const workoutId = workoutDataResponse[0].id;

  const workoutExercises = workout?.workout_exercises;
  if (workoutExercises) {
    const exerciseDetailsData = workoutExercises.map((exercise: WorkoutExerciseType, index: number) => ({
      notes: exercise.notes,
      setInterval: exercise.setInterval,
      order: index,
      exerciseId: exercise.exercise.id,
      sets: exercise.sets,
    }));

    const { data: exerciseDetailsResponse, error: exerciseDetailsError } = await supabase
      .from('ExerciseDetails')
      .insert(exerciseDetailsData)
      .select();

    if (exerciseDetailsError) {
      throw new Error('Error saving exercises, please try again.');
    }

    const workoutExerciseDetailsData = exerciseDetailsResponse.map((exerciseDetail) => ({
      workoutId,
      exerciseDetailsId: exerciseDetail.id,
    }));

    const { error: workoutExerciseDetailsError } = await supabase
      .from('WorkoutExerciseDetails')
      .insert(workoutExerciseDetailsData);

    if (workoutExerciseDetailsError) {
      throw new Error('Error linking exercises to workout, please try again.');
    }
  }
}

export const editWorkout = async (workout: Workout, fetchedWorkout: Workout, workoutTitle: string, workoutDescription: string, setsDetail: SetCounts, totalVolume: number, user: User) => {
  const workoutId = workout!.id;
  const { error: workoutError } = await supabase
    .from('Workouts')
    .update({
      title: workoutTitle,
      description: workoutDescription,
      sets: setsDetail.done,
      volume: totalVolume,
      units: user?.unitPreference,
    })
    .eq('id', workoutId)
    .select();

  if (workoutError) {
    throw new Error('Error saving workout, please try again.');
  }

  const workoutExercises = workout?.workout_exercises;
  if (workoutExercises) {
    const exerciseDetailsData = workoutExercises.map((exerciseDetail, index) => ({
      id: exerciseDetail.id,
      notes: exerciseDetail.notes,
      setInterval: exerciseDetail.setInterval,
      order: index,
      exerciseId: exerciseDetail.exercise.id,
      sets: exerciseDetail.sets,
    }));

    const { data: exerciseDetailsResponse, error: exerciseDetailsError } = await supabase
      .from('ExerciseDetails')
      .upsert(exerciseDetailsData)
      .select();

    if (exerciseDetailsError) {
      throw new Error('Error saving exercises, please try again.');
    }

    const workoutExerciseDetailsData = exerciseDetailsResponse.map((exerciseDetail) => ({
      workoutId,
      exerciseDetailsId: exerciseDetail.id,
    }));

    const { error: workoutExerciseDetailsError } = await supabase
      .from('WorkoutExerciseDetails')
      .upsert(workoutExerciseDetailsData);

    if (workoutExerciseDetailsError) {
      console.log(workoutExerciseDetailsError);
      throw new Error('Error linking exercises to workout, please try again.');
    }
    //Find deleted exercises;
    const originalExercises = fetchedWorkout!.workout_exercises || [];
    const currentExercises = workout!.workout_exercises || [];

    const deletedExercises = originalExercises.filter((originalExercise) => !currentExercises.some((currentExercise) => currentExercise.id === originalExercise.id));
    const deletedExerciseIds = deletedExercises.map((exercise) => exercise.id);

    if (deletedExerciseIds.length > 0) {
      const { error: exerciseError } = await supabase
        .from('ExerciseDetails')
        .delete()
        .in('id', deletedExerciseIds).select();
      if (exerciseError) {
        throw new Error('Error deleting exercises, please try again.');
      }
    }
  }
}