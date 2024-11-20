import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Exercise } from '@/models/Exercise'
import { ExerciseSearchMode } from '@/models/ExerciseSearchMode'
import MuscleIcon from '@/shared/icons/MuscleIcon'
import LoadingAnimation from '@/shared/LoadingAnimation'
import CategoryModal from '@/shared/modals/CategoryModal'
import CreateExerciseModal from '@/shared/modals/CreateExerciseModal'
import EquipmentModal from '@/shared/modals/EquipmentModal'
import MuscleGroupModal from '@/shared/modals/MuscleGroupModal'
import ExerciseListItem from '@/shared/training/exercise-list/ExerciseListItem'
import { useExercisesStore } from '@/stores/exerciseStore'
import { filterPrimaryAndSecondaryMuscles } from '@/utils/workoutUtils'
import { ChevronLeft, DumbbellIcon, Plus, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MdOutlineFilterList } from "react-icons/md"
import { useNavigate } from 'react-router-dom'

//ToDo - Create a component for the ExerciseList and pass the mode as a prop
const mode: ExerciseSearchMode = ExerciseSearchMode.ADD_EXERCISE;

const ExerciseList = () => {
  const navigate = useNavigate();
  const { allExercises } = useExercisesStore();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[] | null>(null);
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [equipmentDrawerOpen, setEquipmentDrawerOpen] = useState(false);
  const [createExerciseOpen, setCreateExerciseOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null);
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

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


  const onPressExercise = (ex: Exercise) => {
    if (mode == ExerciseSearchMode.ADD_EXERCISE) {
      setSelectedExercises(prevExercises => {
        const isExerciseSelected = prevExercises.some(exercise => exercise.id === ex.id);
        if (isExerciseSelected) {
          //If the exercise already exists, remove it from the state
          return prevExercises.filter(exercise => exercise.id !== ex.id);
        } else {
          //If the exercise doesn't exist, add it to the state
          return [...prevExercises, ex];
        }
      });
    } else {
      setSelectedExercises([ex]);
    }
  };

  const buttonText = () => {
    if (mode === ExerciseSearchMode.REPLACE_EXERCISE as ExerciseSearchMode) {
      return `Replace Exercise`
    }
    return selectedExercises.length > 1 ? `Add ${selectedExercises.length} Exercises` : `Add ${selectedExercises.length ? `${selectedExercises.length} Exercise` : 'Exercise'}`
  }

  return (
    <div className='flex flex-col gap-4 flex-grow'>
      <div className='flex flex-col gap-4 sticky top-0 bg-background z-10 pt-4 border-none'>
        <div className='flex flex-row items-center justify-between'>
          <div className='w-10 cursor-pointer' onClick={() => navigate(-1)}>
            <ChevronLeft className="cursor-pointer" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter w-full text-center ">Exercise List</h1>
          <div className='w-10' >
            <PlusCircle className="cursor-pointer" onClick={() => setCreateExerciseOpen(true)} />
          </div>
        </div>

        <Input
          placeholder="Search exercise"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <div className='flex justify-center gap-1'>
          <Button className='w-full' onClick={() => setCategoryDrawerOpen(true)}><MdOutlineFilterList /> Category</Button>
          <Button className='w-full' onClick={() => setEquipmentDrawerOpen(true)}><DumbbellIcon /> Equipment</Button>
          <Button className='w-full' onClick={() => setGroupDrawerOpen(true)}><MuscleIcon className='stroke-white' /> M. Group</Button>
        </div>
        <Separator />
      </div>

      <div className="flex flex-col gap-4 flex-grow overflow-y-auto h-[calc(100vh-HEADER_HEIGHT)]">
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

      <MuscleGroupModal groupDrawerOpen={groupDrawerOpen} setGroupDrawerOpen={setGroupDrawerOpen} />
      <CategoryModal categoryDrawerOpen={categoryDrawerOpen} setCategoryDrawerOpen={setCategoryDrawerOpen} />
      <EquipmentModal equipmentDrawerOpen={equipmentDrawerOpen} setEquipmentDrawerOpen={setEquipmentDrawerOpen} />
      <CreateExerciseModal createExerciseOpen={createExerciseOpen} setCreateExerciseOpen={setCreateExerciseOpen} />

      <div className="fixed bottom-0 left-0 w-full bg-background text-center p-4 shadow-lg border-t border-border">
        <div className="flex flex-row items-center max-w-screen-lg mx-auto">
          <Button className="w-full">
            <Plus className="w-6 h-6" />
            {buttonText()}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExerciseList
