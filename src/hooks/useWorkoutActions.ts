import { useState } from 'react';
import { ExerciseSetIntensity, IntensityScale, SelectedSet, SetType } from '@/models/ExerciseSet';
import { WorkoutState } from '@/stores/workoutStore';
import { UserState } from '@/stores/userStore';

const useWorkoutActions = (workoutStore: WorkoutState, userStore: UserState) => {
  const {
    changeSetType,
    deleteExercise,
    selectedExerciseIndex,
    setSelectedExerciseIndex,
    updateNoteToExercise,
    setIntensityToExerciseSet,
    setRestTimeToExercise
  } = workoutStore;
  const { user } = userStore;

  const [showExerciseNotes, setShowExerciseNotes] = useState(false);
  const [showRestTime, setShowRestTime] = useState(false);
  const [removeExerciseOpen, setRemoveExerciseOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState<SelectedSet | null>(null);
  const [setTypeShown, setSetTypeShown] = useState(false);
  const [showRPEModal, setShowRPEModal] = useState(false);
  const [showRIRModal, setShowRIRModal] = useState(false);

  const handleSaveRestTime = (seconds: number) => {
    setRestTimeToExercise(selectedExerciseIndex, seconds);
    setShowRestTime(false);
    /*ToDo: Handle timer pop up and notification...*/
  };

  const onChangeSetTypePress = (exerciseIndex: string | number[], setIndex: number) => {
    setSelectedSet({ exerciseIndex, setIndex });
    setSetTypeShown(true);
  };

  const onChangeSetType = (setType: SetType) => {
    if (selectedSet) {
      changeSetType(selectedSet.exerciseIndex, selectedSet.setIndex, setType);
      setSelectedSet(null);
      setSetTypeShown(false);
    }
  };

  const handleModalRemoveExercise = (index: number) => {
    setSelectedExerciseIndex(index);
    setRemoveExerciseOpen(true);
  };

  const handleRemoveExercise = () => {
    if (selectedExerciseIndex < 0) return;
    deleteExercise(selectedExerciseIndex);
    setRemoveExerciseOpen(false);
    setSelectedExerciseIndex(-1);
  };

  const handleExerciseNotes = (index: number) => {
    setSelectedExerciseIndex(index);
    setShowExerciseNotes(true);
  };

  const changeNoteEvent = (note: string) => {
    updateNoteToExercise(selectedExerciseIndex, note);
    setShowExerciseNotes(false);
  };

  const onCallShowIntensityModal = (exerciseIndex: string | number[], setIndex: number) => {
    setSelectedSet({ exerciseIndex, setIndex });

    if (user?.intensitySetting === IntensityScale.RIR) {
      setShowRIRModal(true);
    } else {
      setShowRPEModal(true);
    }
  };

  const handleUnsetIntensity = () => {
    if (selectedSet) {
      setIntensityToExerciseSet(selectedSet.exerciseIndex, selectedSet.setIndex, undefined);
      setSelectedSet(null);
      setShowRPEModal(false);
      setShowRIRModal(false);
    }
  };

  const handleSaveIntensity = (intensity: ExerciseSetIntensity) => {
    if (selectedSet) {
      setIntensityToExerciseSet(selectedSet.exerciseIndex, selectedSet.setIndex, intensity);
      setSelectedSet(null);
      setShowRPEModal(false);
      setShowRIRModal(false);
    }
  };

  const handleRestTimeExercise = (index: number) => {
    setSelectedExerciseIndex(index);
    setShowRestTime(true);
  };

  return {
    selectedExerciseIndex,
    showExerciseNotes,
    setShowExerciseNotes,
    showRestTime,
    setShowRestTime,
    removeExerciseOpen,
    setRemoveExerciseOpen,
    selectedSet,
    setSelectedSet,
    setTypeShown,
    setSetTypeShown,
    showRPEModal,
    setShowRPEModal,
    showRIRModal,
    setShowRIRModal,
    handleSaveRestTime,
    onChangeSetTypePress,
    onChangeSetType,
    handleModalRemoveExercise,
    handleRemoveExercise,
    handleExerciseNotes,
    changeNoteEvent,
    onCallShowIntensityModal,
    handleUnsetIntensity,
    handleSaveIntensity,
    handleRestTimeExercise
  };
};

export default useWorkoutActions;
