import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

const MOCK_DELETE = 4; // 2 FOR TESTING
const CreateNewWorkout = () => {
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false)
  const [restDrawerOpen, setRestDrawerOpen] = useState(false)
  const [finishDrawerOpen, setFinishDrawerOpen] = useState(false)
  const [confirmSaveRoutineDialog, setConfirmSaveRoutineDialog] = useState(false)
  const [selectedSet] = useState<null | number>(null)
  const [notes, setNotes] = useState('')
  const [restTimeMinutes, setRestTimeMinutes] = useState('0')
  const [restTimeSeconds, setRestTimeSeconds] = useState('0')
  const [workoutTitle, setWorkoutTitle] = useState('')
  const [workoutDescription, setWorkoutDescription] = useState('')

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
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <div className='w-10'>
          <ChevronLeft className="cursor-pointer" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter w-full text-center mr-10 ">View Workout</h1>
      </div>
      <div>

        <h1 className='text-2xl flex flex-row items-center gap-2'>
          Workout Title
        </h1>
        <h3 className='text-sm font-extralight text-gray-500 text-nowrap flex flex-row gap-2'>John Doe, (Jdoe) <span>-</span><div>Weekname, Month Day, Year</div>
        </h3>
      </div>

      <div className='flex flex-row text-center justify-start gap-10'>
        <div>
          <div className='font-bold'>Sets</div>
          <div>3</div>
        </div>
        <div>
          <div className='font-bold'>Volume</div>
          <div>900kg</div>
        </div>
        <div>
          <div className='font-bold'>Time</div>
          <div>10:01</div>
        </div>
      </div>
      <Separator className='h-[2px]' />
      <div className='py-4 flex-col'>
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
          </div>

          <div>
            <div className='flex flex-row justify-between items-center gap-4'>
              <div className='flex flex-row gap-2 w-full justify-between'>
                <span className='text-md font-bold flex items-center gap-2'>Set</span>
                <span className='text-md font-bold flex items-center gap-2'>Weight</span>
                <span className='text-md font-bold flex items-center gap-2'>Reps</span>
                <span className='text-md font-bold flex items-center gap-2'>RPE</span>
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
                    <span className='text-sm font-bold'>3</span>
                    <span className='text-sm font-bold'>8</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
