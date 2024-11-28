import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { SelectedSet, SetType } from '@/models/ExerciseSet'
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal'
import SetTypeModal from '@/shared/modals/SetTypeModal'
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise'
import WorkoutHeader from '@/shared/training/WorkoutHeader'
import { useWorkoutStore } from '@/stores/workoutStore'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import NoExercises from '../NoExercises'
import NotesModal from '@/shared/modals/NotesModal'
import RPEModal from '@/shared/modals/RPEModal'
import { useUserStore } from '@/stores/userStore'
import { Intensity } from '@/models/Intensity'
import RIRModal from '@/shared/modals/RIRModal'
import RestTimeModal from '@/shared/modals/RestTimeModal'

const CreateNewWorkout = () => {
  const { workout, changeSetType, deleteExercise, selectedExerciseIndex, setSelectedExerciseIndex, updateNoteToExercise, setIntensityToExerciseSet, setRestTimeToExercise } = useWorkoutStore();
  const { user } = useUserStore();
  const [showExerciseNotes, setShowExerciseNotes] = useState(false);
  const [showRestTime, setShowRestTime] = useState(false);
  const [removeExerciseOpen, setRemoveExerciseOpen] = useState(false);
  const [finishDrawerOpen, setFinishDrawerOpen] = useState(false);
  const [confirmSaveRoutineDialog, setConfirmSaveRoutineDialog] = useState(false);
  const [selectedSet, setSelectedSet] = useState<SelectedSet | null>(null);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [setTypeShown, setSetTypeShown] = useState(false);
  const [showRPEModal, setShowRPEModal] = useState(false);
  const [showRIRModal, setShowRIRModal] = useState(false);

  const handleOpenFinishDrawer = () => {
    setFinishDrawerOpen(true)
  }

  const handleSaveRestTime = (seconds: number) => {
    setRestTimeToExercise(selectedExerciseIndex, seconds)
    setShowRestTime(false)
    /*TODO: Handle timer pop up and notification...*/
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

  const onChangeSetTypePress = (exerciseIndex: string | number[], setIndex: number) => {
    setSelectedSet({
      exerciseIndex: exerciseIndex,
      setIndex: setIndex,
    });
    setSetTypeShown(true);
  }

  const onChangeSetType = (setType: SetType) => {
    if (selectedSet) {
      changeSetType(selectedSet.exerciseIndex, selectedSet.setIndex, setType);
      setSelectedSet(null);
      setSetTypeShown(false);
    }
  }

  const handleModalRemoveExercise = (index: number) => {
    setSelectedExerciseIndex(index);
    setRemoveExerciseOpen(true);
  }

  const handleRemoveExercise = () => {
    if (selectedExerciseIndex < 0) { return }
    deleteExercise(selectedExerciseIndex);
    setRemoveExerciseOpen(false);
    setSelectedExerciseIndex(-1);
  }

  const handleExerciseNotes = (index: number) => {
    setSelectedExerciseIndex(index);
    setShowExerciseNotes(true)
  }

  const changeNoteEvent = (note: string) => {
    const index = selectedExerciseIndex;
    setShowExerciseNotes(false);
    updateNoteToExercise(index, note);
  }

  const onCallShowIntensityModal = (exerciseIndex: string | number[], setIndex: number) => {
    setSelectedSet({
      exerciseIndex: exerciseIndex,
      setIndex: setIndex,
    });

    if (user?.intensitySetting === Intensity.RIR) {
      setShowRIRModal(true);
    } else {
      setShowRPEModal(true);
    } 
  }

  const handleUnsetIntensity = () => {
    if (selectedSet) {
      setIntensityToExerciseSet(selectedSet.exerciseIndex, selectedSet.setIndex, undefined);
      setSelectedSet(null);
      setShowRPEModal(false);
      setShowRIRModal(false);
    }
  }

  const handleSaveRPE = (rpe: number) => {
    if (selectedSet) {
      setIntensityToExerciseSet(selectedSet.exerciseIndex, selectedSet.setIndex, rpe);
      setSelectedSet(null);
      setShowRPEModal(false);
    }
  }

  const handleSaveRIR = (rir: number) => {
    if (selectedSet) {
      setIntensityToExerciseSet(selectedSet.exerciseIndex, selectedSet.setIndex, rir);
      setSelectedSet(null);
      setShowRIRModal(false);
    }
  }

  const handleRestTimeExercise = (index: number) => {
    setSelectedExerciseIndex(index);
    setShowRestTime(true);
  }

  return (
    <div className='flex flex-col flex-1'>
      <WorkoutHeader onClose={() => alert('Close')} onFinish={handleOpenFinishDrawer} />

      <div className='flex flex-col flex-grow pt-4'>
        {((workout?.workout_exercises) && (workout.workout_exercises.length > 0)) ? (
          <ScrollArea type="always" className="flex-grow max-h-full h-1">
            <div className="flex flex-col gap-4 flex-grow">
              {workout?.workout_exercises?.map((exercise, index) => (
                <WorkoutExercise
                  id={index}
                  key={`${exercise.id}-${index}`}
                  currentExercise={exercise}
                  onChangeSetTypePress={onChangeSetTypePress}
                  onCallExerciseNotes={() => handleExerciseNotes(index)}
                  onCallRemoveExercise={() => handleModalRemoveExercise(index)}
                  onCallShowIntensityModal={onCallShowIntensityModal}
                  onCallRestTimeExercise={() => handleRestTimeExercise(index)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className='m-auto'>
            <NoExercises />
          </div>
        )}
      </div>

      <ResponsiveModal
        open={removeExerciseOpen}
        onOpenChange={setRemoveExerciseOpen}
        dismissable={true}
        title="Remove Exercise"
        titleClassName="text-lg font-semibold leading-none tracking-tight"
        footer={
          <>
            <Button
              variant='destructive'
              onClick={handleRemoveExercise}
            >
              <Trash /> Confirm
            </Button>
            <Button variant='outline' onClick={() => setRemoveExerciseOpen(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <p>Are you sure you want to remove this exercise?</p>
      </ResponsiveModal>

      <RPEModal showRPEModal={showRPEModal} setShowRPEModal={setShowRPEModal} onSaveIntensity={handleSaveRPE} onUnsetIntensity={handleUnsetIntensity} workout={workout} selectedSet={selectedSet} />
      <RIRModal showRIRModal={showRIRModal} setShowRIRModal={setShowRIRModal} onSaveIntensity={handleSaveRIR} onUnsetIntensity={handleUnsetIntensity} workout={workout} selectedSet={selectedSet} />
      <NotesModal notesShown={showExerciseNotes} exerciseIndex={selectedExerciseIndex} setNotesShown={setShowExerciseNotes} changeNote={changeNoteEvent} workout={workout} />
      <SetTypeModal setTypeShown={setTypeShown} setSetTypeShown={setSetTypeShown} onChangeSetType={onChangeSetType} />
      <RestTimeModal showRestTime={showRestTime} setShowRestTime={setShowRestTime} handleSaveRestTime={handleSaveRestTime}/>

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

      
    </div>
  )
}

export default CreateNewWorkout;