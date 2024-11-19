import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise'
import WorkoutHeader from '@/shared/training/WorkoutHeader'
import { useExercisesStore } from '@/stores/exerciseStore'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useState } from 'react'
import NoExercises from '../NoExercises'

const exercise = 
{
  id: "27c3307b-63f7-4f50-a9e8-c4a3697b55b2",
  exercise: { id: "27c3307b-63f7-4f50-a9e8-c4a3697b55b2", guid: "3_4_Sit-Up", name: "3/4 Sit-Up", category: "Strength", primaryMuscles: ["abdominals"], secondaryMuscles: [], equipment: "Body Only", instructions: ["Lie down on the floor and secure your feet. Your legs should be bent at the knees.", "Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.", "Flex your hips and spine to raise your torso toward your knees.", "At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only Â¾ of the way down.", "Repeat for the recommended amount of repetitions."], isCustom: false, userId: null, createdAt: new Date(), images: ["3_4_Sit-Up/0.jpg", "3_4_Sit-Up/1.jpg"] },
  sets: [],
  setInterval: null,
  notes: ""
}
const MOCK_DELETE = 4; // 2 FOR TESTING
const CreateNewWorkout = () => {
  const { workout } = useWorkoutStore();
  const { allExercises } = useExercisesStore();
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false)
  const [restDrawerOpen, setRestDrawerOpen] = useState(false)
  const [finishDrawerOpen, setFinishDrawerOpen] = useState(false)
  const [confirmSaveRoutineDialog, setConfirmSaveRoutineDialog] = useState(false)
  const [selectedSet, setSelectedSet] = useState<null | number>(null)
  const [notes, setNotes] = useState('')
  const [restTimeMinutes, setRestTimeMinutes] = useState('0')
  const [restTimeSeconds, setRestTimeSeconds] = useState('0')
  const [workoutTitle, setWorkoutTitle] = useState('')
  const [workoutDescription, setWorkoutDescription] = useState('')



  const handleOpenDrawer = (index: number) => {
    setSelectedSet(index)
    setDrawerOpen(true)
  }

  const handleOpenNotesDrawer = (index: number) => {
    setSelectedSet(index)
    setNotesDrawerOpen(true)
  }

  const handleOpenRestDrawer = (index: number) => {
    setSelectedSet(index)
    setRestDrawerOpen(true)
  }

  const handleOpenFinishDrawer = () => {
    setFinishDrawerOpen(true)
  }

  const handleSaveNotes = () => {
    console.log(`Saved notes for set ${selectedSet}: ${notes}`)
    setNotesDrawerOpen(false)
  }

  const handleSaveRestTime = () => {
    console.log(`Saved rest time for set ${selectedSet}: ${restTimeMinutes} min ${restTimeSeconds} sec`)
    setRestDrawerOpen(false)
  }

  const handleSaveWorkout = () => {
    if (!workoutTitle) {
      alert('Workout title is required!')
      return
    }
    console.log(`Workout saved: Title - ${workoutTitle}, Description - ${workoutDescription}`)
    setFinishDrawerOpen(false)
    setConfirmSaveRoutineDialog(true)
  }

  const handleSaveRoutine = () => {
    console.log('Routine changes saved.')
    setConfirmSaveRoutineDialog(false)
  }

  return (
    <div className='flex flex-col  flex-1'>
      <WorkoutHeader onClose={() => alert('Close')} onFinish={handleOpenFinishDrawer} />

      <div className='flex flex-col flex-grow py-4'>
        {((workout?.workout_exercises) && (workout.workout_exercises.length > 0)) ?
          workout?.workout_exercises?.map((exercise, index) => (
            <WorkoutExercise
              id={index}
              key={`${exercise.id}-${index}`}
              currentExercise={exercise}
              handleOpenSettingsModal={() => alert('Open Settings')}
              onChangeSetTypePress={() => alert('Change Set Type')}
              addNotesPress={() => alert('Add Notes')}
            />
          )) : (
            <div className='m-auto'>
              <NoExercises /> 
            </div>
          )}
      </div>
      <div>
        {/* exercises here
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row justify-between items-center gap-4'>
            <div className='flex flex-row items-center gap-4 w-full'>
              <ImageIcon className='w-12 h-12' />
              <div className='flex flex-col'>
                <span className='text-xl font-bold'>Bench Press</span>
                <div className='flex flex-col'>
                  <Badge className='w-min text-nowrap'>Strength</Badge>
                  <span className='text-sm'>Chest</span>
                </div>

              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <LucideEllipsisVertical className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleOpenNotesDrawer(0)}>
                    <span>Notes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenRestDrawer(0)}>
                    <span>Change rest time</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert('Redirect to Exercise List')}>
                    <span>Replace exercise</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowRemoveModal(true)}>
                    <span>Remove exercise</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <div className='flex flex-row justify-between items-center gap-4'>
              <div className='flex flex-row gap-2 w-full justify-between'>
                <span className='text-md font-bold flex items-center gap-2'>Set</span>
                <span className='text-md font-bold flex items-center gap-2'>Weight</span>
                <span className='text-md font-bold flex items-center gap-2'>Reps</span>
                <span className='text-md font-bold flex items-center gap-2'>RPE</span>
                <span className='text-md font-bold flex items-center gap-2'>Done</span>
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              {[...Array(3)].map((_, index) => (
                <div key={index} className='relative'>
                  {index === MOCK_DELETE && (
                    <div className='absolute inset-0 flex justify-end items-center bg-red-500 px-4 rounded-lg'>
                      <span className='text-white font-bold'>Remove</span>
                    </div>
                  )}

                  <div
                    className={cn(
                      `flex flex-row justify-between items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg transition-transform duration-300 relative z-10`,
                      index === MOCK_DELETE ? `translate-x-[-150px]` : `translate-x-0`
                    )}
                  >
                    <span className='text-sm font-bold'>
                      {index !== MOCK_DELETE ? index + 1 : <span className='text-red-500'>F</span>}
                    </span>
                    <span className='text-sm font-bold'>100kg</span>
                    <Input className='text-sm font-bold border-none shadow-none w-8 ml-2 text-center' value={3} readOnly />
                    <Input className='text-sm font-bold border-none shadow-none w-8 text-center' value={8} readOnly />
                    <CheckCircle2
                      size={24}
                      className={index !== 2 ? 'text-green-600 cursor-pointer' : ''}
                      onClick={() => handleOpenDrawer(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button className='flex items-center justify-center gap-2 text-white'>Add Set</Button>
        </div>
         */}
      </div>

      <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Exercise</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove this exercise?</p>
          <DialogFooter>
            <Button
              variant='destructive'
              onClick={() => {
                setShowRemoveModal(false)
                alert('Exercise Removed')
              }}
            >
              Confirm
            </Button>
            <Button variant='outline' onClick={() => setShowRemoveModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drawer for selecting set type */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Set Type</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Button className="w-full mb-2">Warm-up</Button>
            <Button className="w-full mb-2">Normal</Button>
            <Button className="w-full mb-2">Failure</Button>
            <Button className="w-full mb-2">Drop set</Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer for finishing the workout */}
      <Drawer open={finishDrawerOpen} onOpenChange={setFinishDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Finish Workout</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Input
              placeholder="Workout title (required)"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              className="mb-4"
            />
            <Textarea
              placeholder="Description"
              value={workoutDescription}
              onChange={(e) => setWorkoutDescription(e.target.value)}
              className="mb-4 h-52"
            />
            <div className="mb-4">
              <p className="font-bold">Summary:</p>
              <p>Duration: 10 minutes</p>
              <p>Exercises: 1</p>
              <p>Sets: 3</p>
            </div>
            <Button onClick={handleSaveWorkout} className="w-full">
              Save Workout
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Confirmation dialog for saving changes to routine */}
      <Dialog open={confirmSaveRoutineDialog} onOpenChange={setConfirmSaveRoutineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Routine Changes</DialogTitle>
          </DialogHeader>
          <p>Do you want to save the changes to the routine?</p>
          <DialogFooter>
            <Button
              variant='destructive'
              onClick={() => {
                handleSaveRoutine()
              }}
            >
              Confirm
            </Button>
            <Button variant='outline' onClick={() => setConfirmSaveRoutineDialog(false)}>
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drawer for adding notes */}
      <Drawer open={notesDrawerOpen} onOpenChange={setNotesDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Notes</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Textarea
              placeholder="Enter your notes here"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mb-4 h-52"
            />
            <Button onClick={handleSaveNotes} className="w-full">
              Save
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer for changing rest time */}
      <Drawer open={restDrawerOpen} onOpenChange={setRestDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Set Rest Time</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="0"
                placeholder="Min"
                value={restTimeMinutes}
                onChange={(e) => setRestTimeMinutes(e.target.value)}
                className="w-1/2"
              />
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="Sec"
                value={restTimeSeconds}
                onChange={(e) => setRestTimeSeconds(e.target.value)}
                className="w-1/2"
              />
            </div>
            <Button onClick={handleSaveRestTime} className="w-full mt-4">
              Save
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default CreateNewWorkout
