import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ResponsiveModal } from "@/shared/modals/ResponsiveModal";
import { useEffect, useMemo, useState } from "react";
import { Workout } from "@/models/Workout";
import { SelectedSet } from "@/models/ExerciseSet";

type CreateExerciseModalProps = {
  showRIRModal: boolean;
  setShowRIRModal: (open: boolean) => void;
  onUnsetIntensity: () => void;
  onSaveIntensity: (rir: number) => void;
  selectedSet: SelectedSet | null;
  workout: Workout | null;
};

const DEFAULT_RIR = 3;
const RIRModal = ({ showRIRModal, setShowRIRModal, onUnsetIntensity, onSaveIntensity, selectedSet, workout }: CreateExerciseModalProps) => {
  const [rirValue, setRirValue] = useState(DEFAULT_RIR);

  const getSet = (workout: Workout | null, selectedSet: SelectedSet | null) => {
    if (!workout || !selectedSet) return null;
    const exercise = workout.workout_exercises.find(
      (exercise) => exercise.id === selectedSet.exerciseIndex
    );
    return exercise?.sets?.[selectedSet.setIndex] ?? null;
  };

  const currentSet = useMemo(() => getSet(workout, selectedSet), [workout, selectedSet]);

  useEffect(() => {
    if (currentSet?.intensity !== undefined) {
      setRirValue(currentSet.intensity);
    } else {
      setRirValue(DEFAULT_RIR);
    }
  }, [currentSet, showRIRModal]);

  const getGradient = (value: number) => {
    if (value === 0) return "bg-gradient-to-r from-red-500 to-red-800";
    if (value <= 3) return "bg-gradient-to-r from-yellow-400 to-orange-400";
    return "bg-gradient-to-r from-green-400 to-green-300";
  };

  const getDescription = (value: number): string => {
    if (value === 0) return "Max effort, no reps left in reserve";
    return `${value} rep${value === 1 ? "" : "s"} left in reserve`;
  };

  return (
    <ResponsiveModal
      open={showRIRModal}
      onOpenChange={setShowRIRModal}
      title="Exercise Intensity (RIR)"
      dismissable={true}
      titleClassName="text-lg font-semibold leading-none tracking-tight text-center"
      footer={
        <>
          <Button onClick={() => onSaveIntensity(rirValue)} className="w-full">
            Save
          </Button>
          <Button variant={`outline`} onClick={onUnsetIntensity} className="w-full">
            Unset
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 items-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={rirValue}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.03 }}
            className={`text-center text-6xl font-bold bg-clip-text text-transparent ${getGradient(
              rirValue
            )}`}
          >
            {rirValue}
          </motion.div>
        </AnimatePresence>

        <div className="text-center text-xs md:text-sm mt-4 text-foreground/75">
          {getDescription(rirValue)}
        </div>

        <div className="w-full h-2 rounded">
          <Slider
            value={[rirValue]}
            max={10}
            step={1}
            onValueChange={(value) => setRirValue(value[0])}
            className="w-full"
          />
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default RIRModal
