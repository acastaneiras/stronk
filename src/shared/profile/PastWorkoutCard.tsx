import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Workout } from '@/models/Workout'
import { useUserStore } from '@/stores/userStore'
import { useWorkoutStore } from '@/stores/workoutStore'
import { formatTime, formatWeightDecimals, getCategoryColor } from '@/utils/workoutUtils'
import { Edit, EllipsisVertical, Eye, ImageIcon, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PastWorkoutCard = ({pastWorkout, handleDeleteWorkoutPress}: {pastWorkout: Workout, handleDeleteWorkoutPress: (pastWorkout: Workout) => void}) => {
  const navigate = useNavigate();
  const {user} = useUserStore();
  const {workout, setWorkout, setFetchedWorkout, setOnGoingWorkout, setIsEditing} = useWorkoutStore();

  const handleEditWorkoutClick = () => {
		if (workout) { // If there is a workout, set the ongoing workout to the current workout
			setOnGoingWorkout(workout);
		}
		setWorkout(pastWorkout);
		setFetchedWorkout(pastWorkout);
		setIsEditing(true);
		navigate('/training/edit-workout');
	}
  return (
    <Card className="shadow-none bg-secondary/80">
      <CardHeader>
        <CardTitle className='flex flex-row justify-between'>
          <div className='flex flex-col'>
            <h1 className="text-2xl flex flex-row items-center gap-2">
              {pastWorkout.title}
            </h1>
            <h3 className="text-sm font-extralight text-gray-500 dark:text-gray-100">
              {user?.firstName} {user?.lastName} {`(${user?.alias})`}
            </h3>
          </div>
          <div className='pl-4 py-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <EllipsisVertical className="h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 flex flex-col gap-1">
                <DropdownMenuItem asChild>
                  <Button variant="ghost" className="w-full justify-start border-none cursor-pointer" onClick={handleEditWorkoutClick}>
                    <Edit className="h-4 w-4 mr-2" /> Edit workout
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button variant="destructive" onClick={() =>handleDeleteWorkoutPress(pastWorkout)} className="w-full justify-start border-none cursor-pointer">
                    <Trash className="h-4 w-4 mr-2" /> Delete workout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
        <CardDescription>
          {pastWorkout.date.format("dddd, MMMM D, YYYY")} at {pastWorkout.date.format("h:mm A")}
        </CardDescription>
        <div className="flex flex-row text-center gap-10">
          <div>
            <div className="font-bold">{pastWorkout?.duration ? formatTime(pastWorkout?.duration) : "N/A"}</div>
            <div>Time</div>
          </div>
          <div>
            <div className="font-bold">{formatWeightDecimals(pastWorkout.volume)} {user?.unitPreference}</div>
            <div>Volume</div>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {pastWorkout.workout_exercises.slice(0, 2).map((exercise, index) => (
            <div key={`${exercise.id.toString()}-${index}`} className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-4">
                <ImageIcon />
                <div>
                  <h1 className="text-xl font-bold">{exercise.exercise.name}</h1>
                  <p className="text-gray-500 dark:text-gray-100">{exercise.sets.length} {exercise.sets.length > 1 ? 'sets' : 'set'}</p>
                </div>
              </div>
              <div>
                <Badge style={{ backgroundColor: getCategoryColor(exercise.exercise.category!) }}>{exercise.exercise.category}</Badge>
              </div>
            </div>
          ))}
          {pastWorkout.workout_exercises.length > 2 && (
            <div className="text-gray-500 dark:text-gray-100 text-sm">
              ({pastWorkout.workout_exercises.length - 2} more {pastWorkout.workout_exercises.length - 2 > 1 ? "exercises" : "exercise"})
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button><Eye /> View Details</Button>
      </CardFooter>
    </Card>
  )
}

export default PastWorkoutCard