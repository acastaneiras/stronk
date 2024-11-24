import { WeightUnit } from "./ExerciseSet";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  alias: string;
  unitPreference: WeightUnit;
  intensitySetting: string;
}