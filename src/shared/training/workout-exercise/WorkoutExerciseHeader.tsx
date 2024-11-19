import { WorkoutExerciseType } from '@/models/WorkoutExerciseType';
import { getCategoryColor } from '@/utils/workoutUtils';
import { Menu } from 'lucide-react';
import { useState } from 'react';

type WorkoutExerciseHeaderProps = {
  currentExercise: WorkoutExerciseType;
  openSettingsEvent: () => void;
  addNotesEvent: () => void;
};

const MAX_CHARACTERS_TO_SHOW = 80;

const WorkoutExerciseHeader = ({ currentExercise }: WorkoutExerciseHeaderProps) => {
  const [expandNotes, setExpandNotes] = useState(false);

  const categoryColor = getCategoryColor(currentExercise.exercise.category!);

  return (
    <div className='flex flex-row justify-between'>
      <div
        className="flex items-center space-x-4 px-4 py-2"
      >
        <img
          //src={currentExercise.exercise.images![0] || 'default-image.webp'}
          src='/default-image.webp'
          alt="Exercise"
          className={`w-16 h-16 rounded border-2`}
          style={{ borderColor: `${categoryColor}` }}
        />
        <div className="flex flex-col flex-1 gap-1 items-start">
          <div className="flex flex-col gap-1 items-start justify-between">
            <h2 className="font-bold text-lg text-primary">
              {currentExercise.exercise.name}
            </h2>
            {currentExercise.exercise.category && (
              <span
                className={`px-2 py-1 rounded text-white flex-grow-0 text-xs`}
                style={{backgroundColor: `${categoryColor}`}}
              >
                {currentExercise.exercise.category}
              </span>
            )}
          </div>
          {currentExercise.exercise.primaryMuscles!.length > 0 && (
            <p className="text-sm text-gray-500 capitalize">
              {currentExercise.exercise.primaryMuscles!.join(', ')}
            </p>
          )}
          {currentExercise.notes && (
            <div className="mt-2 text-sm">
              <p>
                {expandNotes || currentExercise.notes.length <= MAX_CHARACTERS_TO_SHOW
                  ? currentExercise.notes
                  : `${currentExercise.notes.slice(0, MAX_CHARACTERS_TO_SHOW)}...`}
              </p>
              {currentExercise.notes.length > MAX_CHARACTERS_TO_SHOW && (
                <button
                  className="text-blue-500"
                  onClick={() => setExpandNotes(!expandNotes)}
                >
                  {expandNotes ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className='px-4 py-3'>
        <div className='p-0 cursor-pointer'>
          <Menu className='h-5'></Menu>
        </div>
      </div>
    </div>
  );
}

export default WorkoutExerciseHeader;
