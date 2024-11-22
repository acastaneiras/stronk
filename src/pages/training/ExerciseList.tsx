import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Exercise } from '@/models/Exercise'
import LoadingAnimation from '@/shared/LoadingAnimation'
import CategoryModal from '@/shared/modals/CategoryModal'
import CreateExerciseModal from '@/shared/modals/CreateExerciseModal'
import EquipmentModal from '@/shared/modals/EquipmentModal'
import MuscleGroupModal from '@/shared/modals/MuscleGroupModal'
import ExerciseListHeader from '@/shared/training/exercise-list/ExerciseListHeader'
import ExerciseListItem from '@/shared/training/exercise-list/ExerciseListItem'
import NoExercisesFound from '@/shared/training/exercise-list/NoExercisesFound'
import { useExercisesStore } from '@/stores/exerciseStore'
import { useWorkoutStore } from '@/stores/workoutStore'
import { filterPrimaryAndSecondaryMuscles } from '@/utils/workoutUtils'
import { useEffect, useState } from 'react'

const ExerciseList = () => {
  const { allExercises } = useExercisesStore();
  const { selectedExercises, addOrReplaceExercise } = useWorkoutStore();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[] | null>(null);
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [equipmentDrawerOpen, setEquipmentDrawerOpen] = useState(false);
  const [createExerciseOpen, setCreateExerciseOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null);
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!allExercises) {
      setIsLoading(true);
      return;
    }
    setFilteredExercises(allExercises);
    setIsLoading(false);
  }, [allExercises]);

  useEffect(() => {
    if (allExercises == null) {
      return;
    }
    const hasActiveFilters =
      searchValue.trim() !== '' ||
      categoryFilter !== null ||
      equipmentFilter !== null ||
      muscleGroupFilter !== null;

    const filters = [
      (item: Exercise) => !searchValue || item.name.toLowerCase().includes(searchValue.toLowerCase()),
      (item: Exercise) => !categoryFilter || item.category?.toLowerCase().includes(categoryFilter.toLowerCase()),
      (item: Exercise) => !equipmentFilter || (item.equipment && item.equipment.toLowerCase().includes(equipmentFilter.toLowerCase())),
      (item: Exercise) => !muscleGroupFilter ||
        (item.primaryMuscles && item.primaryMuscles.includes(muscleGroupFilter))
    ];

    let filteredData = allExercises.filter(item => filters.every(filter => filter(item)));

    if (muscleGroupFilter) {
      filteredData = filterPrimaryAndSecondaryMuscles(filteredData, muscleGroupFilter);
    }

    if (!hasActiveFilters) {
      setFilteredExercises(allExercises);
    } else if (filteredData.length > 0) {
      setFilteredExercises(filteredData);
    } else {
      setFilteredExercises(null);
    }
  }, [searchValue, categoryFilter, equipmentFilter, muscleGroupFilter, allExercises]);


  const onPressExercise = (exercise: Exercise) => {
    addOrReplaceExercise(exercise);
  };

  const handleFilterCateogry = (category: string) => {
    if (category != '') {
      setCategoryFilter(category);
    } else {
      setCategoryFilter(null);
    }
    setCategoryDrawerOpen(false);
  }

  const handleFilterEquipment = (equipment: string) => {
    if (equipment != '') {
      setEquipmentFilter(equipment);
    } else {
      setEquipmentFilter(null);
    }
    setEquipmentDrawerOpen(false);
  }

  const handleFilterMuscle = (muscle: string) => {
    if (muscle != '') {
      setMuscleGroupFilter(muscle.toLowerCase());
    } else {
      setMuscleGroupFilter(null);
    }
    setGroupDrawerOpen(false);
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
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        equipmentFilter={equipmentFilter}
        setEquipmentFilter={setEquipmentFilter}
        muscleGroupFilter={muscleGroupFilter}
        setMuscleGroupFilter={setMuscleGroupFilter}
      />

      <div className="flex flex-col flex-grow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center flex-grow">
            <LoadingAnimation />
          </div>
        ) : filteredExercises && filteredExercises.length > 0 ? (
          <ScrollArea type="always" className="flex-grow max-h-full h-1">
            <div className="flex flex-col gap-4 flex-grow">
              {filteredExercises.map((filteredExercise) => {
                const isSelected = selectedExercises.some(
                  (exercise) => exercise.id === filteredExercise.id
                );
                return (
                  <ExerciseListItem
                    exercise={filteredExercise}
                    key={filteredExercise.id}
                    onPress={() => onPressExercise(filteredExercise)}
                    selected={isSelected}
                  />
                );
              })}
            </div>
            <ScrollBar orientation="vertical" className="h-full" />
          </ScrollArea>
        ) : (
          <div className="flex justify-center items-center flex-grow">
            <NoExercisesFound />
          </div>
        )}
      </div>

      <MuscleGroupModal groupDrawerOpen={groupDrawerOpen} setGroupDrawerOpen={setGroupDrawerOpen} currentMuscleGroup={muscleGroupFilter} filterMuscleGroup={handleFilterMuscle} />
      <CategoryModal categoryDrawerOpen={categoryDrawerOpen} setCategoryDrawerOpen={setCategoryDrawerOpen} currentCategory={categoryFilter} filterCategory={handleFilterCateogry} />
      <EquipmentModal equipmentDrawerOpen={equipmentDrawerOpen} setEquipmentDrawerOpen={setEquipmentDrawerOpen} currentEquipment={equipmentFilter} filterEquipment={handleFilterEquipment} />
      <CreateExerciseModal createExerciseOpen={createExerciseOpen} setCreateExerciseOpen={setCreateExerciseOpen} />
    </div>
  )
}

export default ExerciseList
