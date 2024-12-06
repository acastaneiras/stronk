import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
import { supabase } from '@/utils/supabaseClient'
import { formatWeightUnit, getTotalSets, getTotalVolume } from '@/utils/workoutUtils'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Save, Trash } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import NoExercises from '../NoExercises'

const workoutSchema = z.object({
  title: z.string().min(1, { message: 'Routine title is required.' }),
});

const EditRoutine = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const { routine, emptyRoutine, fetchedRoutine, changeSetType, deleteExercise, selectedExerciseIndex, setSelectedExerciseIndex, updateNoteToExercise, setIntensityToExerciseSet, setRestTimeToExercise, setRoutineTitle } = useWorkoutStore();

  const setsDetail: SetCounts = getTotalSets(routine);
  const totalVolume = getTotalVolume(routine, true);

  const [showExerciseNotes, setShowExerciseNotes] = useState(false);
  const [showRestTime, setShowRestTime] = useState(false);
  const [removeExerciseOpen, setRemoveExerciseOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState<SelectedSet | null>(null);
  const [setTypeShown, setSetTypeShown] = useState(false);
  const [showRPEModal, setShowRPEModal] = useState(false);
  const [showRIRModal, setShowRIRModal] = useState(false);

  const handleSaveRestTime = (seconds: number) => {
    setRestTimeToExercise(selectedExerciseIndex, seconds)
    setShowRestTime(false)
    /*ToDo: Handle timer pop up and notification...*/
  }

  const handleSaveRoutine = async () => {
    if (!routine) return;
    const routineData = {
      title: routine.title,
    };

    const validation = workoutSchema.safeParse(routineData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    try {
      const routineId = routine.id;
      const { error: routineError } = await supabase
        .from('Routines')
        .update({
          title: routine.title,
        })
        .eq('id', routineId)
        .select();

      if (routineError) {
        throw new Error('Error saving routine, please try again.');
      }

      const routineExercises = routine?.workout_exercises;
      if (routineExercises) {
        const exerciseDetailsData = routineExercises.map((exerciseDetail, index) => ({
          id: exerciseDetail.id,
          notes: exerciseDetail.notes,
          setInterval: exerciseDetail.setInterval,
          order: index,
          exerciseId: exerciseDetail.exercise.id,
          sets: exerciseDetail.sets,
        }));

        const { data: exerciseDetailsResponse, error: exerciseDetailsError } = await supabase
          .from('ExerciseDetails')
          .upsert(exerciseDetailsData)
          .select();

        if (exerciseDetailsError) {
          throw new Error('Error saving exercises, please try again.');
        }

        const routineExerciseDetailsData = exerciseDetailsResponse.map((exerciseDetail) => ({
          routineId,
          exerciseDetailsId: exerciseDetail.id,
        }));

        const { error: routineExerciseDetailsError } = await supabase
          .from('RoutineExerciseDetails')
          .upsert(routineExerciseDetailsData);

        if (routineExerciseDetailsError) {
          throw new Error('Error linking exercises to routine, please try again.');
        }
        //Find deleted exercises from routine
        const originalExercises = fetchedRoutine!.workout_exercises || [];
        const currentExercises = routine!.workout_exercises || [];

        const deletedExercises = originalExercises.filter((originalExercise) => !currentExercises.some((currentExercise) => currentExercise.id === originalExercise.id));
        const deletedExerciseIds = deletedExercises.map((exercise) => exercise.id);

        if (deletedExerciseIds.length > 0) {
          const { error: exerciseError } = await supabase
            .from('ExerciseDetails')
            .delete()
            .in('id', deletedExerciseIds).select();
          if (exerciseError) {
            throw new Error('Error deleting exercises, please try again.');
          }
        }
      }

      await queryClient.invalidateQueries(
        {
          queryKey: ["routines", user?.id],
          refetchType: 'active',
        },
        {
          cancelRefetch: true,
          throwOnError: true,
        }
      );

      toast.success('Routine saved successfully!');
      navigate('/training');
      emptyRoutine();
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
            <button onClick={() => { navigate("/training"); }}>
              <ChevronLeft />
            </button>
          </div>
          <h1 className="text-xl font-bold tracking-tighter w-full text-center ">Edit Routine</h1>
          <div className='flex gap-2'>
            <Button onClick={handleSaveRoutine}><Save /><span className='hidden md:block'>Save</span></Button>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <Input placeholder='Routine title' className='w-full' value={routine?.title}
            onChange={(e) => setRoutineTitle(e.target.value)} />
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
        </div>
        <Separator className='h-[2px]' />
      </div>
      <div className='flex flex-col flex-grow'>
        {((routine?.workout_exercises) && (routine.workout_exercises.length > 0)) ? (
          <ScrollArea type="always" className="flex-grow max-h-full h-1">
            <div className="flex flex-col gap-4 flex-grow pt-4">
              {routine?.workout_exercises?.map((exercise, index) => (
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
            <NoExercises type='routine' />
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

      <RPEModal showRPEModal={showRPEModal} setShowRPEModal={setShowRPEModal} onSaveIntensity={handleSaveRPE} onUnsetIntensity={handleUnsetIntensity} workout={routine} selectedSet={selectedSet} />
      <RIRModal showRIRModal={showRIRModal} setShowRIRModal={setShowRIRModal} onSaveIntensity={handleSaveRIR} onUnsetIntensity={handleUnsetIntensity} workout={routine} selectedSet={selectedSet} />
      <NotesModal notesShown={showExerciseNotes} exerciseIndex={selectedExerciseIndex} setNotesShown={setShowExerciseNotes} changeNote={changeNoteEvent} workout={routine} />
      <SetTypeModal setTypeShown={setTypeShown} setSetTypeShown={setSetTypeShown} onChangeSetType={onChangeSetType} />
      <RestTimeModal showRestTime={showRestTime} setShowRestTime={setShowRestTime} handleSaveRestTime={handleSaveRestTime} />
    </div>
  )
}

export default EditRoutine
