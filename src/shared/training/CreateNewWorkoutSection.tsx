import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SetCounts } from "@/models/Workout";
import { useUserStore } from "@/stores/userStore";
import { useWorkoutStore } from "@/stores/workoutStore";
import { formatTime, getTotalSets, getTotalVolume } from "@/utils/workoutUtils";
import { Dumbbell, Hash, Play, Timer, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateNewWorkoutSection = () => {
  const { workout, weightUnits, newWorkout, setIsTimerEnabled, emptyWorkout  } = useWorkoutStore();
  const { user } = useUserStore();
	const navigate = useNavigate();

  const setsDetail: SetCounts = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);


  const createNewWorkout = () => {
		startNewWorkout();
	};

	const startNewWorkout = () => {
		navigate('/training/create-new-workout');
		newWorkout(user!.id);
		setIsTimerEnabled(true);
	}

  if (!workout || workout.duration === null) return (
    <Button className='w-full' onClick={createNewWorkout}>Create New Workout</Button>
  )

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex justify-around py-4">
          <CardTitle className="text-2xl font-bold">Ongoing Workout</CardTitle>

          <CardDescription className="flex flex-row justify-around mt-2">
            <div className="flex flex-col items-center">
              <Hash className="w-6 h-6 " />
              <span className="text-sm font-semibold">Sets</span>
              <span className="">{setsDetail.done} of {setsDetail.total}</span>
            </div>
            <div className="flex flex-col items-center">
              <Dumbbell className="w-6 h-6" />
              <span className="text-sm font-semibold">Volume</span>
              <span className="">{totalVolume}{weightUnits}</span>
            </div>
            <div className="flex flex-col items-center">
              <Timer className="w-6 h-6" />
              <span className="text-sm font-semibold">Time</span>
              <span className="">{formatTime(workout.duration)}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between gap-4">
          <Button
            onClick={() => navigate('/training/create-new-workout')}
            className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Continue
          </Button>
          <Button
            onClick={() => emptyWorkout()}
            variant={`destructive`}
            className="w-full">
            <X className="w-4 h-4 mr-2" />
            Discard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateNewWorkoutSection;
