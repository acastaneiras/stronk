import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'

const CreateNewWorkout = () => {
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
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <div className='w-10'>
          <ChevronLeft className="cursor-pointer" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter w-full text-center mr-10 ">Exercise Overview</h1>
      </div>
      <h1 className="text-3xl font-bold tracking-tighter ">Exercise Name</h1>
      <div className='flex flex-col'>
        <Badge className='w-min text-nowrap'>Strength</Badge>
        <span className='text-sm'>Primary Muscles: X, Y, Z</span>
        <span className='text-sm'>Secondary Muscles: A, B, C</span>
      </div>
      <div className='flex flex-row text-center justify-center h-32 items-center border-2 rounded'>
        Exercise Image
      </div>
      <h1 className='text-lg font-bold tracking-tighter'>Instructions</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      <div className='flex flex-row text-center justify-center h-32 items-center border-2 rounded'>
        Chart
      </div>

      <div className='py-4 flex-col'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-lg font-bold tracking-tighter'>Records</h1>
          <ul>
            <li><strong>Maximum weight lifted</strong>: Xkg</li>
            <li><strong>Best set volume</strong>: Xkg x X reps</li>
          </ul>
        </div>
      </div>
      <div className='py-4 flex-col'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-lg font-bold tracking-tighter'>History</h1>
          <div className='flex flex-col'>
            <div className='grid grid-cols-2 border-b pb-2'>
              <h1 className='text-xl font-bold text-left'>Reps</h1>
              <h1 className='text-xl font-bold text-left'>Weight</h1>
            </div>
            <div className='grid grid-cols-2 py-2 border-b'>
              <span className='text-xl text-left'>5</span>
              <span className='text-xl text-left'>45kg</span>
            </div>
            <div className='grid grid-cols-2 py-2 border-b'>
              <span className='text-xl text-left'>8</span>
              <span className='text-xl text-left'>50kg</span>
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
