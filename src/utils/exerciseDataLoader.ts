import { supabase } from "../utils/supabaseClient";
import { Exercise } from "../models/Exercise";
import { ExercisesState } from "../stores/exerciseStore";

const EXERCISES_VERSION = import.meta.env.VITE_EXERCISES_VERSION;

export const loadData = (store: ExercisesState) => {
  const storeVersion = Number(store.version);
  const versionChange = (EXERCISES_VERSION === undefined) || (storeVersion < Number(EXERCISES_VERSION));

  loadExercises(versionChange, store.addExercises, store.allExercises);
  loadMuscleGroups(versionChange, store.addMuscles, store.allMuscles);
  loadEquipment(versionChange, store.addEquipment, store.allEquipment);
  loadCategories(versionChange, store.addCategories, store.allCategories);

  store.setVersion(Number(EXERCISES_VERSION));
};

async function loadEquipment(versionChange: boolean, addEquipment: (equipment: string[]) => void, allEquipment: string[] | null) {
  if (!versionChange && allEquipment?.length) {
    //Using cached data
    return;
  }

  const { data, error } = await supabase.rpc('get_equipment');

  if (error) {
    console.error('Error fetching equipment:', error);
    return;
  }

  const equipment = Array.isArray(data)
    ? data.map((row) => row.equipment)
    : [];
  addEquipment(equipment);
}

async function loadCategories(versionChange: boolean, addCategories: (categories: string[]) => void, allCategories: string[] | null) {
  if (!versionChange && allCategories?.length) {
    //Using cached data
    return;
  }

  const { data, error } = await supabase.rpc('get_categories');

  if (error) {
    console.error('Error fetching categories:', error);
    return;
  }

  const categories = Array.isArray(data)
    ? data.map((row) => row.category)
    : [];
  addCategories(categories);
}

async function loadMuscleGroups(versionChange: boolean, addMuscles: (muscles: string[]) => void, allMuscles: string[] | null) {
  if (!versionChange && allMuscles?.length) {
    //Using cached data
    return;
  }

  const { data, error } = await supabase.rpc('get_muscles');

  if (error) {
    console.error('Error fetching muscles:', error);
    return;
  }

  const muscles = Array.isArray(data)
    ? data.map((row) => row.muscle)
    : [];
  addMuscles(muscles);
}

async function loadExercises(versionChange: boolean, addExercises: (exercises: Exercise[]) => void, allExercises: Exercise[] | null) {
  if (!versionChange && allExercises?.length) {
    //Using cached data
    return;
  }

  const { data, error } = await supabase
    .from('Exercises')
    .select(`*`).order('name', { ascending: true });

  if (error) {
    console.error('Error fetching exercises:', error);
    return;
  }
  const exercises = data as Exercise[];
  addExercises(exercises);
}
