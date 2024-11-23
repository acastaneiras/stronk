import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SetCounts } from '@/models/Workout';
import WorkoutTimer, { TimerHandle } from '@/shared/training/WorkoutTimer';
import { useUserStore } from '@/stores/userStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { formatWeightUnit, getTotalSets, getTotalVolume, getWorkoutPercentage } from '@/utils/workoutUtils';
import { ChevronLeft } from 'lucide-react';
import { useRef } from 'react';
import WorkoutProgress from './WorkoutProgress';

const WorkoutHeader = ({ onClose, onFinish }: { onClose: () => void; onFinish: () => void; }) => {
  const timerRef = useRef<TimerHandle>(null);
  const { workout } = useWorkoutStore();
  const { user } = useUserStore();

  const setsDetail: SetCounts = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);
  const workoutPercentage = getWorkoutPercentage(setsDetail);

  const handleClose = () => {
    timerRef.current?.saveTimer();
    onClose();
  };

  const handleFinish = () => {
    timerRef.current?.saveTimer();
    onFinish();
  };

  return (
    <div className='flex flex-col gap-4 sticky top-0 bg-background z-10 pt-4 border-none'>
      <div className='flex flex-row items-center justify-between'>
        <div className='w-10'>
          <button onClick={handleClose} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-300" />
          </button>
        </div>
        <h1 className="text-xl font-bold tracking-tighter w-full text-center ">Ongoing Workout</h1>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={handleFinish}>
            Finish
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
          <div>{totalVolume} {user ? formatWeightUnit(user.unitPreference) : "Kg"}</div>
        </div>
        <div>
          <div className="font-bold">Time</div>
          <WorkoutTimer ref={timerRef}></WorkoutTimer>
        </div>
      </div>
      <WorkoutProgress workoutPercentage={workoutPercentage}></WorkoutProgress>
      <Separator />
    </div>

  );
};

export default WorkoutHeader;
