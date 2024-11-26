import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Workout } from '@/models/Workout';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import { TriangleAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type NotesModalProps = {
  notesShown: boolean;
  exerciseIndex: number;
  changeNote: (note: string) => void;
  setNotesShown: (notesShown: boolean) => void;
  workout: Workout | null;
};

const MAX_WORD_COUNT = 300;

const NotesModal = ({ notesShown, exerciseIndex, changeNote, setNotesShown, workout }: NotesModalProps) => {
  const [notes, setNotes] = useState('');
  const [wordCountError, setWordCountError] = useState(false);

  const getExercise = (workout: Workout | null, exerciseIndex: number) => {
    if (!workout || !workout.workout_exercises || exerciseIndex === -1) return null;
    return workout.workout_exercises[exerciseIndex] ?? null;
  };

  const exercise = useMemo(() => getExercise(workout, exerciseIndex), [workout, exerciseIndex]);

  useEffect(() => {
    setWordCountError(notes.length > MAX_WORD_COUNT);
  }, [notes]);

  useEffect(() => {
    if (exercise?.notes && notesShown) {
      setNotes(exercise.notes);
    }
  }, [exercise?.notes, notesShown]);

  const handleSaveNotes = () => {
    if (wordCountError) return;
    changeNote(notes);
    setNotes('');
    setNotesShown(false);
  };

  const handleCancel = () => {
    setNotes('');
    setNotesShown(false);
  };

  return (
    <ResponsiveModal
      open={notesShown}
      onOpenChange={setNotesShown}
      dismissable
      title={
        <div>
          Notes for{' '}
          <span className="font-bold">
            {exercise?.exercise?.name || 'exercise'}
          </span>
        </div>
      }
      titleClassName="text-lg font-semibold leading-none tracking-tight"
      footer={
        <>
          <Button onClick={handleSaveNotes} disabled={wordCountError}>
            Save
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </>
      }
    >
      {wordCountError && (
        <Alert className="mb-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Word Limit Exceeded</AlertTitle>
          <AlertDescription>
            A note must contain up to <span className="font-bold">{MAX_WORD_COUNT}</span> characters.
          </AlertDescription>
        </Alert>
      )}
      <Textarea
        placeholder="Enter your notes here"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="mb-4 h-52"
      />
    </ResponsiveModal>
  );
};

export default NotesModal;
