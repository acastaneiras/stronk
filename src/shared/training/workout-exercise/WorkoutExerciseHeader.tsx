import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode';
import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import { useWorkoutStore } from '@/stores/workoutStore';
import { getCategoryColor } from '@/utils/workoutUtils';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Clock, FileText, ImageIcon, Replace, Settings2, Trash } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type WorkoutExerciseHeaderProps = {
  index: number;
  isViewing?: boolean;
  currentExercise: WorkoutExerciseType;
  onCallRemoveExercise: () => void;
  onCallExerciseNotes: () => void;
  onCallRestTimeExercise: () => void;
};

const MAX_CHARACTERS_TO_SHOW = 80;
const EXERCISE_PICTURES_URL = import.meta.env.VITE_EXERCISE_PICTURES_URL;

const WorkoutExerciseHeader = ({ index, isViewing = false, currentExercise, onCallRemoveExercise, onCallExerciseNotes, onCallRestTimeExercise }: WorkoutExerciseHeaderProps) => {
  const navigate = useNavigate();

  const { setExerciseSearchMode, setSelectedExerciseIndex } = useWorkoutStore();
  const [expandNotes, setExpandNotes] = useState(false);
  const [imageError, setImageError] = useState(false);

  const categoryColor = getCategoryColor(currentExercise.exercise.category!);

  const navigateToReplaceExercise = () => {
    setExerciseSearchMode(ExerciseSearchMode.REPLACE_EXERCISE);
    setSelectedExerciseIndex(index);
    navigate('/training/exercise-list');
  }
  return (
    <div className='flex flex-row justify-between'>
      <div
        className="flex items-center space-x-4 px-4 py-2"
      >
        {!imageError ? (
          <img
            src={`${EXERCISE_PICTURES_URL}${currentExercise.exercise.images?.[0]}`}
            alt="Exercise"
            className={`w-16 h-16 rounded border-2`}
            style={{ borderColor: `${categoryColor}` }}
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageIcon className="text-muted-foreground w-8 h-8" data-testid="image-icon" />
        )}

        <div className="flex flex-col flex-1 gap-1 items-start">
          <div className="flex flex-col gap-1 items-start justify-between">
            <h2 className="font-bold text-lg text-primary">
              <Link to={`/training/exercise-overview/${currentExercise.exercise.id}`}>
                {currentExercise.exercise.name}
              </Link>
            </h2>
            <div className='flex flex-row gap-2'>
              {currentExercise.exercise.category && (
                <Badge
                  className={`px-2 py-1 rounded text-white flex-grow-0 text-xs`}
                  style={{ backgroundColor: `${categoryColor}` }}
                >
                  {currentExercise.exercise.category}
                </Badge>
              )}
              {currentExercise.setInterval != null && currentExercise.setInterval > 0 && (
                <Badge className="px-2 py-1 rounded flex-grow-0 text-xs gap-1" variant="outline">
                  <Clock className="h-4 w-4" /> {dayjs(currentExercise.setInterval * 1000).format("mm:ss")}
                </Badge>
              )}
            </div>
          </div>
          {currentExercise.exercise.primaryMuscles!.length > 0 && (
            <p className="text-sm text-gray-500 capitalize">
              {currentExercise.exercise.primaryMuscles!.join(', ')}
            </p>
          )}
          {currentExercise.notes && (
            <div className='block'>
              <p
                className={clsx(
                  'break-words mt-2 text-sm',
                  !expandNotes && 'max-h-12 overflow-hidden text-ellipsis'
                )}
              >
                {expandNotes || currentExercise.notes.length <= MAX_CHARACTERS_TO_SHOW
                  ? currentExercise.notes
                  : `${currentExercise.notes.slice(0, MAX_CHARACTERS_TO_SHOW)}...`}
              </p>
              {currentExercise.notes.length > MAX_CHARACTERS_TO_SHOW && (
                <button
                  className="text-primary underline mt-1"
                  onClick={() => setExpandNotes(!expandNotes)}
                >
                  {expandNotes ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {!isViewing && (
        <div className='px-4 py-3'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label={`exercise-settings-${currentExercise.id}-${index}`}>
                <Settings2 className="h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 flex flex-col gap-1">
              <DropdownMenuLabel>Exercise Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button variant="ghost" className="w-full justify-start border-none cursor-pointer" onClick={onCallExerciseNotes} aria-label={`exercise-notes-${currentExercise.id}-${index}`}>
                  <FileText className="h-4 w-4 mr-2" /> Notes
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button variant="ghost" className="w-full justify-start border-none cursor-pointer" onClick={onCallRestTimeExercise} aria-label={`exercise-rest-${currentExercise.id}-${index}`}>
                  <Clock className="h-4 w-4 mr-2" /> Rest time
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button variant="ghost" className="w-full justify-start border-none cursor-pointer" onClick={navigateToReplaceExercise} aria-label={`exercise-replace-${currentExercise.id}-${index}`}>
                  <Replace className="h-4 w-4 mr-2" /> Replace exercise
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button variant="destructive" onClick={onCallRemoveExercise} className="w-full justify-start border-none cursor-pointer" aria-label={`exercise-remove-${currentExercise.id}-${index}`}>
                  <Trash className="h-4 w-4 mr-2" /> Remove exercise
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

export default WorkoutExerciseHeader;
