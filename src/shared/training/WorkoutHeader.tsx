import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SetCounts } from '@/models/Workout';
import WorkoutTimer from '@/shared/training/WorkoutTimer';
import { useUserStore } from '@/stores/userStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { formatWeightDecimals, formatWeightUnit, getTotalSets, getTotalVolume, getWorkoutPercentage, incompleteSets } from '@/utils/workoutUtils';
import { ChevronLeft, FlagIcon } from 'lucide-react';
import WorkoutProgress from './WorkoutProgress';

const WorkoutHeader = ({ onClose, onFinish }: { onClose: () => void; onFinish: (showBeofreFinishModal: boolean) => void; }) => {
  const { workout } = useWorkoutStore();
  const { user } = useUserStore();

  const setsDetail: SetCounts = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);
  const workoutPercentage = getWorkoutPercentage(setsDetail);

  const handleClose = () => {
    onClose();
  };

  const beforeOnFinish = () => {
    if (!workout) return;
    let showBeofreFinishModal = false;
    if (incompleteSets(workout) || workout?.workout_exercises?.length === 0) {
      showBeofreFinishModal = true;
    }
    onFinish(showBeofreFinishModal);
  };

  return (
    <div className='flex flex-col gap-4 sticky top-0 bg-background z-10 pt-4 border-none'>
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0">
          <button onClick={handleClose} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-300" />
          </button>
        </div>
        <h1 className="text-xl font-bold tracking-tighter mx-auto">
          Ongoing Workout
        </h1>
        <div className="absolute right-0">
          <Button variant="outline" onClick={beforeOnFinish}>
            <FlagIcon />
            <span className="hidden md:block">Finish</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 text-center gap-8">
        <div>
          <div className="font-bold">Sets</div>
          <div>{setsDetail.done}/{setsDetail.total}</div>
        </div>
        <div>
          <div className="font-bold">Volume</div>
          <div>{formatWeightDecimals(totalVolume)} {user ? formatWeightUnit(user.unitPreference) : "Kg"}</div>
        </div>
        <div>
          <div className="font-bold">Time</div>
          <WorkoutTimer></WorkoutTimer>
        </div>
      </div>
      <WorkoutProgress workoutPercentage={workoutPercentage}></WorkoutProgress>
      <Separator />
    </div>

  );
};

export default WorkoutHeader;
