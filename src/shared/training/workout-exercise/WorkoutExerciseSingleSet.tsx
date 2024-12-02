import { Button } from '@/components/ui/button';
import { ExerciseSet } from '@/models/ExerciseSet';
import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import IconSet from '@/shared/icons/IconSet';
import WeightInput from '@/shared/training/workout-exercise/workout-exercise-sets/WeightInput';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useMediaQuery } from '@uidotdev/usehooks';
import clsx from 'clsx';
import { Check, Trash2 } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import { useState } from 'react';
import RepsInput from './workout-exercise-sets/RepsInput';
import { useUserStore } from '@/stores/userStore';
import { Intensity } from '@/models/Intensity';

type WorkoutExerciseSingleSetProps = {
  set: ExerciseSet;
  setIndex: number;
  currentExercise: WorkoutExerciseType;
  callShowIntensityModal: (setIndex: number) => void;
  onChangeSetType: () => void;
};

function WorkoutExerciseSingleSet({ set, setIndex, currentExercise, callShowIntensityModal, onChangeSetType }: WorkoutExerciseSingleSetProps) {
  const { user } = useUserStore();
  const { toggleSetCompletion, deleteSetToExercise } = useWorkoutStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isSwiped, setIsSwiped] = useState(false);
  const controls = useAnimation();

  const handleSetCompleted = (setIndex: number) => {
    toggleSetCompletion(currentExercise.id, setIndex);
  };

  const onDeleteSet = () => {
    setIsSwiped(false);
    controls.start({ x: 0 });
    deleteSetToExercise(currentExercise.id, setIndex);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    const swipeThreshold = -100;
    if (info.offset.x < swipeThreshold) {
      setIsSwiped(true);
    } else {
      setIsSwiped(false);
      controls.start({ x: 0 });
    }
  };

  return (
    <motion.div
      className="relative"
    >
      <motion.div
        className="absolute left-0 right-0 top-0 flex items-center justify-end md:pr-10"
        style={{ height: '100%', zIndex: isSwiped ? 0 : -1 }}
        animate={{ opacity: isSwiped ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onTouchEnd={onDeleteSet}
          onClick={onDeleteSet}
          variant="destructive"
          className="py-2"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </motion.div>

      <div className="bg-background">
        <motion.div
          className={clsx(
            "relative flex items-center text-center py-2 rounded",
            { "bg-primary/10": set.completed }
          )}
          drag="x"
          dragConstraints={{ left: isDesktop ? -160 : -120, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ x: 0 }}
          style={{ zIndex: 1 }}
        >
          <div className={clsx(user?.intensitySetting !== "none" ? "w-1/5" : "w-1/4")}>
            <Button
              onClick={onChangeSetType}
              variant="ghost"
              className="px-4 py-1 rounded"
            >
              <IconSet setType={set.type} setNumber={set.number} />
            </Button>
          </div>
          <div className={clsx(user?.intensitySetting !== "none" ? "w-1/5" : "w-1/4", "px-1 md:px-10")}>
            <WeightInput
              set={set}
              setIndex={setIndex}
              currentExercise={currentExercise}
            />
          </div>
          <div className={clsx(user?.intensitySetting !== "none" ? "w-1/5" : "w-1/4", "px-1 md:px-10")}>
            <RepsInput
              set={set}
              setIndex={setIndex}
              currentExercise={currentExercise}
            />
          </div>
          {((user?.intensitySetting) && ([Intensity.RPE, Intensity.RIR].includes(user?.intensitySetting as Intensity))) && (
            <div className="w-1/5">
              <Button
                variant="ghost"
                onClick={() => callShowIntensityModal(setIndex)}
                className="px-4 py-1 rounded text-lg text-gray-500"
              >
                {set.intensity ? `@ ${set.intensity.value.toFixed(1)}` : "@"}
              </Button>
            </div>)}
          <div className={clsx(user?.intensitySetting !== "none" ? "w-1/5" : "w-1/4")}>
            <Button
              onClick={() => handleSetCompleted(setIndex)}
              variant={set.completed ? "default" : "outline"}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default WorkoutExerciseSingleSet;
