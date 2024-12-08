import { Input } from "@/components/ui/input";
import { ExerciseSet } from "@/models/ExerciseSet";
import { WorkoutExerciseType } from "@/models/WorkoutExerciseType";
import { useWorkoutStore } from "@/stores/workoutStore";

type RepsInputProps = {
  set: ExerciseSet;
  setIndex: number;
  currentExercise: WorkoutExerciseType;
  readOnly?: boolean;
};

const RepsInput = ({ set, setIndex, currentExercise, readOnly = false }: RepsInputProps) => {
  const { changeRepsFromExercise } = useWorkoutStore();

  const handleEditRepsEvent = (
    exerciseIndex: string | number[],
    setIndex: number,
    setReps: number | string = ""
  ) => {
    if (currentExercise) {
      const currentSet = currentExercise.sets[setIndex];
      if (currentSet) {
        let parsedReps: number | string = "";
        if (/^(?:[0-9]+|)$/.test(setReps.toString())) {
          parsedReps = setReps;
        }
        changeRepsFromExercise(exerciseIndex, setIndex, parsedReps);
      }
    }
  };

  const handleInputChange = (text: string) => {
    let newReps: number | string = "";
    if (text !== "") {
      newReps = parseInt(text, 10);
    } else {
      newReps = text;
    }
    handleEditRepsEvent(currentExercise.id, setIndex, newReps);
  };

  return (
    <Input
      onChange={(e) => handleInputChange(e.target.value)}
      placeholder="0"
      type="text"
      className="text-base text-center p-2"
      value={set.reps.toString()}
      onFocus={(e) =>
        e.target.setSelectionRange(
          set.reps.toString().length,
          set.reps.toString().length
        )
      }
      readOnly={readOnly}
    />
  );
};

export default RepsInput;
