import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SetCounts } from "@/models/Workout";
import { useUserStore } from "@/stores/userStore";
import { useWorkoutStore } from "@/stores/workoutStore";
import { calculateElapsedSecondsFromDate, formatTime, getTotalSets, getTotalVolume } from "@/utils/workoutUtils";
import { Dumbbell, Hash, Play, Plus, Timer, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateNewWorkoutSection = () => {
  const { workout, newWorkout, emptyWorkout } = useWorkoutStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const setsDetail: SetCounts = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);


  const createNewWorkout = () => {
    newWorkout(user!.id);
    navigate('/training/create-new-workout');
  };

  const continueWorkout = () => {
    navigate('/training/create-new-workout')
  };

  if (!workout) return (
    <Button className='w-full' onClick={createNewWorkout}><Plus /> Create New Workout</Button>
  )

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-secondary/80 shadow-none">
        <CardHeader className="pb-0 space-y-0">
          <CardTitle className="text-2xl font-semibold">Ongoing Workout</CardTitle>
          <CardDescription />
        </CardHeader>
        <div className="flex flex-row justify-between px-10 py-4">
          <div className="flex flex-col items-center">
            <Hash className="w-6 h-6" />
            <span className="text-sm font-semibold">Sets</span>
            <span className="">{setsDetail.done} of {setsDetail.total}</span>
          </div>
          <div className="flex flex-col items-center">
            <Dumbbell className="w-6 h-6" />
            <span className="text-sm font-semibold">Volume</span>
            <span className="">{totalVolume} {user?.unitPreference}</span>
          </div>
          <div className="flex flex-col items-center">
            <Timer className="w-6 h-6" />
            <span className="text-sm font-semibold">Time</span>
            <span className="">{formatTime(calculateElapsedSecondsFromDate(workout.date))}</span>
          </div>
        </div>
        <CardFooter className="gap-4">
          <Button
            onClick={continueWorkout}
            className="w-full">
            <Play className="w-4 h-4" />
            Continue
          </Button>
          <Button
            onClick={() => emptyWorkout()}
            variant={`destructive`}
            className="w-full">
            <X className="w-4 h-4" />
            Discard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateNewWorkoutSection;
