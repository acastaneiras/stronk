import { Input } from "@/components/ui/input";
import { ExerciseSet, SetWeight } from "@/models/ExerciseSet";
import { WorkoutExerciseType } from "@/models/WorkoutExerciseType";
import { useWorkoutStore } from "@/stores/workoutStore";
import { z } from "zod";

type WeightInputProps = {
  set: ExerciseSet;
  setIndex: number;
  currentExercise: WorkoutExerciseType;
};

const WeightInput = ({ set, setIndex, currentExercise }: WeightInputProps) => {
  const { changeWeightFromExercise } = useWorkoutStore();

  //Only allow numbers and a dot for decimal numbers for the weight input
  const weightSchema = z.object({
    value: z
      .string()
      .regex(/^\d*\.?\d{0,3}$/, "Weight must be a number")
      .or(z.literal("")),
  });

  const displayWeight = (setWeight: SetWeight) => {
    let weightDisplay = "";
    weightDisplay = setWeight.value.toString();

    return weightDisplay;
  }

  const handleEditWeightEvent = (exerciseIndex: string | number[], setIndex: number, setWeight: SetWeight) => {
    if (currentExercise) {
      const set = currentExercise.sets[setIndex];

      if (set) {
        const parsedWeight = weightSchema.safeParse({ value: setWeight.value.toString().replace(",", ".") });

        if (parsedWeight.success) {
          changeWeightFromExercise(exerciseIndex, setIndex, setWeight);
        } else {
          setWeight.value = "";
          changeWeightFromExercise(exerciseIndex, setIndex, setWeight);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight = e.target.value;
    if (/^\d*\.?\d{0,3}$/.test(newWeight)) {
      const { unit } = set.weight;
      const setClone = { value: newWeight, unit };
  
      handleEditWeightEvent(currentExercise.id, setIndex, setClone);
    } else {
      e.preventDefault();
    }
  };

  return (
    <Input
      onChange={handleInputChange}
      placeholder="0"
      type="text"
      className="text-base text-center p-2"
      value={displayWeight(set.weight)}
      onFocus={(e) =>
        e.target.setSelectionRange(
          displayWeight(set.weight).length,
          displayWeight(set.weight).length
        )
      }
    />
  );
};

export default WeightInput;
