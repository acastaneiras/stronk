import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ResponsiveModal } from "@/shared/modals/ResponsiveModal";
import { useEffect, useMemo, useState } from "react";
import { Workout } from "@/models/Workout";
import { SelectedSet } from "@/models/ExerciseSet";

type CreateExerciseModalProps = {
  showRPEModal: boolean;
  setShowRPEModal: (open: boolean) => void;
  onUnsetIntensity: () => void;
  onSaveIntensity: (rpe: number) => void;
  selectedSet: SelectedSet | null;
  workout: Workout | null;
};

const DEFAULT_RPE = 7;
const RPEModal = ({ showRPEModal, setShowRPEModal, onUnsetIntensity, onSaveIntensity, selectedSet, workout }: CreateExerciseModalProps) => {
  const [rpeValue, setRpeValue] = useState(DEFAULT_RPE);

  const getSet = (workout: Workout | null, selectedSet: SelectedSet | null) => {
    if (!workout || !selectedSet) return null;
    const exercise = workout.workout_exercises.find((exercise) => exercise.id === selectedSet.exerciseIndex);
    return exercise?.sets?.[selectedSet.setIndex] ?? null;
  };

  const currentSet = useMemo(
    () => getSet(workout, selectedSet),
    [workout, selectedSet]
  );

  useEffect(() => {
    if (currentSet?.intensity) {
      setRpeValue(currentSet.intensity);
    } else if (showRPEModal) {
      setRpeValue(DEFAULT_RPE);
    }
  }, [currentSet, showRPEModal]);

  const getGradient = (value: number) => {
    if (value >= 9.5) return "bg-gradient-to-r from-red-500 to-red-800";
    if (value >= 8.5) return "bg-gradient-to-r from-orange-400 to-red-500";
    if (value >= 7.5) return "bg-gradient-to-r from-yellow-400 to-orange-400";
    if (value >= 5) return "bg-gradient-to-r from-green-300 to-yellow-400";
    return "bg-gradient-to-r from-green-400 to-green-300";
  };

  const rpeScale = [
    { min: 10, description: "Could not do more repetitions or weight" },
    { min: 9.5, description: "Could not do more repetitions, could do slightly more weight" },
    { min: 9, description: "Could do 1 more repetition" },
    { min: 8.5, description: "Could do 1 more repetitions, possible 2 more repetitions" },
    { min: 8, description: "Could do 2 more repetitions" },
    { min: 7.5, description: "Could do 2 more, possibly 3 more repetitions" },
    { min: 7, description: "Could do 3 more repetitions" },
    { min: 5, description: "Could do 4 to 6 more repetitions" },
    { min: 0, description: "Very light effort" },
  ];

  const getDescription = (value: number): string => {
    const match = rpeScale.find((entry) => value >= entry.min);
    return match ? match.description : "Invalid value";
  };

  return (
    <ResponsiveModal
      open={showRPEModal}
      onOpenChange={setShowRPEModal}
      title="Exercise Intensity (RPE)"
      dismissable={true}
      titleClassName="text-lg font-semibold leading-none tracking-tight text-center"
      footer={
        <>
          <Button onClick={() => onSaveIntensity(rpeValue)} className="w-full">
            Save
          </Button>
          <Button variant={`outline`} onClick={onUnsetIntensity} className="w-full">
            Unset
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 items-center py-4">
        <div
          key={rpeValue}
          className={`text-center text-6xl font-bold bg-clip-text text-transparent ${getGradient(
            rpeValue
          )}`}
        >
          {rpeValue.toFixed(1)}
        </div>
        <div className="text-center text-xs md:text-sm mt-4 text-foreground/75">
          {getDescription(rpeValue)}
        </div>

        <div className="w-full h-2 rounded">
          <Slider
            defaultValue={[rpeValue]}
            max={10}
            step={0.5}
            onValueChange={(value) => setRpeValue(value[0])}
            className="w-full"
          />
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default RPEModal;
