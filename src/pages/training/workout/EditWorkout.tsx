import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ExerciseSetIntensity, IntensityScale, SelectedSet, SetType } from '@/models/ExerciseSet'
import { SetCounts } from '@/models/Workout'
import NotesModal from '@/shared/modals/NotesModal'
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal'
import RestTimeModal from '@/shared/modals/RestTimeModal'
import RIRModal from '@/shared/modals/RIRModal'
import RPEModal from '@/shared/modals/RPEModal'
import SetTypeModal from '@/shared/modals/SetTypeModal'
import WorkoutExercise from '@/shared/training/workout-exercise/WorkoutExercise'
import { useUserStore } from '@/stores/userStore'
import { useWorkoutStore } from '@/stores/workoutStore'
import { editWorkout } from '@/utils/apiCalls'
import { formatTime, formatWeightUnit, getTotalSets, getTotalVolume, incompleteSets } from '@/utils/workoutUtils'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Save, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import NoExercises from '../NoExercises'

const workoutSchema = z.object({
  title: z.string().nonempty("Workout title is required."),
  description: z.string().optional(),
});

const EditWorkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useUserStore();
  const { workout, fetchedWorkout, changeSetType, deleteExercise, selectedExerciseIndex, setSelectedExerciseIndex, updateNoteToExercise, setIntensityToExerciseSet, setRestTimeToExercise } = useWorkoutStore();

  const setsDetail: SetCounts = getTotalSets(workout);
  const totalVolume = getTotalVolume(workout);

  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [showExerciseNotes, setShowExerciseNotes] = useState(false);
  const [showRestTime, setShowRestTime] = useState(false);
  const [removeExerciseOpen, setRemoveExerciseOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState<SelectedSet | null>(null);
  const [setTypeShown, setSetTypeShown] = useState(false);
  const [showRPEModal, setShowRPEModal] = useState(false);
  const [showRIRModal, setShowRIRModal] = useState(false);
  const [showIncompleteExerciseModal, setShowIncompleteExerciseModal] = useState(false);

  useEffect(() => {
    if (workout) {
      setWorkoutTitle(workout?.title || '');
    }
  }, [workout]);

  const handleSaveRestTime = (seconds: number) => {
    setRestTimeToExercise(selectedExerciseIndex, seconds)
    setShowRestTime(false)
    /*ToDo: Handle timer pop up and notification...*/
  }

  const handleSaveWorkoutPress = async () => {
    if (!workout || !fetchedWorkout) return;
    if (incompleteSets(workout) || workout?.workout_exercises?.length === 0) {
      setShowIncompleteExerciseModal(true);
      return;
    }

    handleSaveWorkout();
  }

  const handleSaveWorkout = async () => {
    const workoutData = {
      title: workoutTitle,
      description: workoutDescription,
    };

    const validation = workoutSchema.safeParse(workoutData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    try {
      await editWorkout(workout!, fetchedWorkout!, workoutTitle, workoutDescription, setsDetail, totalVolume, user!);

      await queryClient.invalidateQueries(
        {
          queryKey: ["workouts", user?.id],
          refetchType: 'active',
        },
        {
          cancelRefetch: true,
          throwOnError: true,
        }
      );

      toast.success('Workout saved successfully!');
      navigate('/profile');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };


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

    if (user?.intensitySetting === IntensityScale.RIR) {
      setShowRIRModal(true);
    } else {
      setShowRPEModal(true);
    }
  }

  const handleUnsetIntensity = () => {
    if (selectedSet) {
      setShowRPEModal(false);
      setShowRIRModal(false);
      setIntensityToExerciseSet(selectedSet.exerciseIndex, selectedSet.setIndex, undefined);
      setSelectedSet(null);
    }
  }

  const handleSaveRPE = (rpe: ExerciseSetIntensity) => {
    if (selectedSet) {
      setIntensityToExerciseSet(selectedSet.exerciseIndex, selectedSet.setIndex, rpe);
      setSelectedSet(null);
      setShowRPEModal(false);
    }
  }

  const handleSaveRIR = (rir: ExerciseSetIntensity) => {
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
      <div className='flex flex-col gap-4'>
        <div className='flex flex-row items-center justify-between pt-4'>
          <div className='w-10'>
            <button onClick={() => {navigate(-1);}}>
              <ChevronLeft />
            </button>
          </div>
          <h1 className="text-xl font-bold tracking-tighter w-full text-center ">Edit Workout</h1>
          <div className='flex gap-2'>
            <Button onClick={handleSaveWorkoutPress}><Save /><span className='hidden md:block'>Save</span></Button>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <Input placeholder='Workout title' className='w-full' value={workoutTitle}
            onChange={(e) => setWorkoutTitle(e.target.value)} />
          <Textarea placeholder='Workout description' className='w-full max-h-96' value={workoutDescription}
            onChange={(e) => setWorkoutDescription(e.target.value)} />
        </div>
        <div className='flex flex-row text-center justify-center gap-24'>
          <div>
            <div className='font-bold'>Sets</div>
            <div>{setsDetail.done}/{setsDetail.total}</div>
          </div>
          <div>
            <div className='font-bold'>Volume</div>
            <div>{totalVolume} {user ? formatWeightUnit(user.unitPreference) : "Kg"}</div>
          </div>
          <div>
            <div className='font-bold'>Time</div>
            <div>{workout?.duration && (formatTime(workout.duration!))}</div>
          </div>
        </div>
        <Separator className='h-[2px]' />
      </div>
      <div className='flex flex-col flex-grow'>
        {((workout?.workout_exercises) && (workout.workout_exercises.length > 0)) ? (
          <ScrollArea type="always" className="flex-grow max-h-full h-1">
            <div className="flex flex-col gap-4 flex-grow pt-4">
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
            <ScrollBar />
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
      <RestTimeModal showRestTime={showRestTime} setShowRestTime={setShowRestTime} handleSaveRestTime={handleSaveRestTime} />

      <ResponsiveModal
        open={showIncompleteExerciseModal}
        onOpenChange={setShowIncompleteExerciseModal}
        dismissable={true}
        title="Incomplete Sets"
        titleClassName="text-lg font-semibold leading-none tracking-tight"
        footer={
          <>
            <Button variant='outline' onClick={() => setShowIncompleteExerciseModal(false)}>
              Dismiss
            </Button>
          </>
        }
      >
        <p>It appears you have some incomplete sets, please complete those sets before saving.</p>
      </ResponsiveModal>
    </div>
  )
}

export default EditWorkout
