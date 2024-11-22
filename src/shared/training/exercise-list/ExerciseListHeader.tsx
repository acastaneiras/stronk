import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import ExerciseFilterButton from '@/shared/buttons/ExerciseFilterButton';
import MuscleIcon from '@/shared/icons/MuscleIcon';
import { getCategoryColor } from '@/utils/workoutUtils';
import { ChevronLeft, DumbbellIcon, PlusCircle, X } from 'lucide-react';
import { MdOutlineFilterList } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

type ExerciseListHeaderProps = {
  searchValue: string;
  categoryFilter: string | null;
  equipmentFilter: string | null;
  muscleGroupFilter: string | null;
  setCategoryFilter: (value: string | null) => void;
  setEquipmentFilter: (value: string | null) => void;
  setMuscleGroupFilter: (value: string | null) => void;
  setSearchValue: (value: string) => void;
  setCreateExerciseOpen: (value: boolean) => void;
  setCategoryDrawerOpen: (value: boolean) => void;
  setEquipmentDrawerOpen: (value: boolean) => void;
  setGroupDrawerOpen: (value: boolean) => void;
};


const ExerciseListHeader = ({ searchValue, categoryFilter, equipmentFilter, muscleGroupFilter, setSearchValue, setCreateExerciseOpen, setCategoryDrawerOpen, setEquipmentDrawerOpen, setGroupDrawerOpen, setCategoryFilter, setEquipmentFilter, setMuscleGroupFilter }: ExerciseListHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sticky top-0 bg-background z-10 pt-4 border-none">
      <div className="flex flex-row items-center justify-between">
        <div className="w-10 cursor-pointer" onClick={() => navigate(-1)}>
          <ChevronLeft className="cursor-pointer" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter w-full text-center">Exercise List</h1>
        <div className="w-10">
          <PlusCircle className="cursor-pointer" onClick={() => setCreateExerciseOpen(true)} />
        </div>
      </div>

      <Input
        placeholder="Search exercise"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <div className="flex justify-center gap-1">
        <Button className="w-full" onClick={() => setCategoryDrawerOpen(true)}>
          <MdOutlineFilterList /> Category
        </Button>
        <Button className="w-full" onClick={() => setEquipmentDrawerOpen(true)}>
          <DumbbellIcon /> Equipment
        </Button>
        <Button className="w-full" onClick={() => setGroupDrawerOpen(true)}>
          <MuscleIcon className="stroke-white" /> M. Group
        </Button>
      </div>
      <div className="flex flex-row items-center flex-wrap gap-2">
        {categoryFilter && (
          <ExerciseFilterButton filter={categoryFilter} filterColor={getCategoryColor(categoryFilter)} onClose={() => setCategoryFilter(null)} icon={<MdOutlineFilterList className='h-4 w-4' />} />
        )}
        {equipmentFilter && (
          <ExerciseFilterButton filter={equipmentFilter} onClose={() => setEquipmentFilter(null)} icon={<DumbbellIcon className='h-4 w-4' />} />
        )}
        {muscleGroupFilter && (
          <ExerciseFilterButton filter={muscleGroupFilter} onClose={() => setMuscleGroupFilter(null)} icon={<MuscleIcon className='stroke-foreground h-4 w-4' />} />
        )}
      </div>
      <Separator />
    </div>
  );
};
export default ExerciseListHeader;