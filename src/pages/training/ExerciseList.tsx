import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Exercise } from '@/models/Exercise'
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode'
import LoadingAnimation from '@/shared/LoadingAnimation'
import CategoryModal from '@/shared/modals/CategoryModal'
import CreateExerciseModal from '@/shared/modals/CreateExerciseModal'
import EquipmentModal from '@/shared/modals/EquipmentModal'
import MuscleGroupModal from '@/shared/modals/MuscleGroupModal'
import ExerciseListHeader from '@/shared/training/exercise-list/ExerciseListHeader'
import ExerciseListItem from '@/shared/training/exercise-list/ExerciseListItem'
import { useExercisesStore } from '@/stores/exerciseStore'
import { useWorkoutStore } from '@/stores/workoutStore'
import { filterPrimaryAndSecondaryMuscles } from '@/utils/workoutUtils'
import { useEffect, useState } from 'react'

//ToDo - Create a component for the ExerciseList and pass the mode as a prop
const mode: ExerciseSearchMode = ExerciseSearchMode.ADD_EXERCISE;

const ExerciseList = () => {
  const { allExercises } = useExercisesStore();
  const {selectedExercises, addOrReplaceExercise} = useWorkoutStore();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[] | null>(null);
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [equipmentDrawerOpen, setEquipmentDrawerOpen] = useState(false);
  const [createExerciseOpen, setCreateExerciseOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null);
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    if (filteredExercises == null) {
      setFilteredExercises(allExercises);
    }
  }, [allExercises, filteredExercises]);

  useEffect(() => {
    if (allExercises == null) {
      return;
    }
    const filters = [
      (item: Exercise) => !searchValue || item.name.toLowerCase().includes(searchValue.toLowerCase()),
      (item: Exercise) => !categoryFilter || item.category?.toLowerCase().includes(categoryFilter.toLowerCase()),
      (item: Exercise) => !equipmentFilter || (item.equipment && item.equipment.toLowerCase().includes(equipmentFilter.toLowerCase())),
      (item: Exercise) => !muscleGroupFilter ||
        (item.primaryMuscles && item.primaryMuscles.includes(muscleGroupFilter)) ||
        (item.secondaryMuscles && item.secondaryMuscles.includes(muscleGroupFilter))
    ];

    let filteredData = allExercises.filter(item => filters.every(filter => filter(item)));

    if (muscleGroupFilter) {
      filteredData = filterPrimaryAndSecondaryMuscles(filteredData, muscleGroupFilter);
    }

    if (filteredData?.length > 0) {
      setFilteredExercises(filteredData);
    } else {
      setFilteredExercises(null);
    }
  }, [searchValue, categoryFilter, equipmentFilter, muscleGroupFilter, allExercises]);


  const onPressExercise = (exercise: Exercise) => {
    addOrReplaceExercise(exercise);
  };

  const handleFilterCateogry = (category: string) => {
    if (category != 'All Categories') {
      setCategoryFilter(category);
    } else {
      setCategoryFilter(null);
    }
    setCategoryDrawerOpen(false);
  }

  return (
    <div className='flex flex-col gap-4 justify-center flex-grow'>
      <ExerciseListHeader
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setCreateExerciseOpen={setCreateExerciseOpen}
        setCategoryDrawerOpen={setCategoryDrawerOpen}
        setEquipmentDrawerOpen={setEquipmentDrawerOpen}
        setGroupDrawerOpen={setGroupDrawerOpen}
      />

      <div className='flex flex-col flex-grow overflow-hidden'>
        <ScrollArea type='always' className='flex-grow max-h-full h-1'>
          <div className="flex flex-col gap-4 flex-grow">
            {filteredExercises && filteredExercises.length > 0
              ? filteredExercises.map((filteredExercise) => {
                const isSelected = selectedExercises.some(exercise => exercise.id === filteredExercise.id);
                return <ExerciseListItem exercise={filteredExercise} key={filteredExercise.id} onPress={() => onPressExercise(filteredExercise)} selected={isSelected} />;
              })
              : (
                <div className='flex justify-center items-center flex-grow'>
                  <LoadingAnimation />
                </div>
              )
            }
          </div>
          <ScrollBar orientation='vertical' className='h-full' />
        </ScrollArea>
      </div>

      <MuscleGroupModal groupDrawerOpen={groupDrawerOpen} setGroupDrawerOpen={setGroupDrawerOpen} />
      <CategoryModal categoryDrawerOpen={categoryDrawerOpen} setCategoryDrawerOpen={setCategoryDrawerOpen} currentCategory={categoryFilter} filterCategory={handleFilterCateogry} />
      <EquipmentModal equipmentDrawerOpen={equipmentDrawerOpen} setEquipmentDrawerOpen={setEquipmentDrawerOpen} />
      <CreateExerciseModal createExerciseOpen={createExerciseOpen} setCreateExerciseOpen={setCreateExerciseOpen} />
    </div>
  )
}

export default ExerciseList
