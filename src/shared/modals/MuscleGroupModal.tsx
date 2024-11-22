import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useExercisesStore } from '@/stores/exerciseStore';
import { ResponsiveModal } from './ResponsiveModal';

type MuscleGroupModalProps = {
  groupDrawerOpen: boolean;
  setGroupDrawerOpen: (open: boolean) => void;
  currentMuscleGroup: string | null;
  filterMuscleGroup: (groupName: string) => void;
};

type MuscleAndLabel = {
  muscle: string;
  label: string;
};

const MuscleGroupModal = ({ groupDrawerOpen, setGroupDrawerOpen, currentMuscleGroup, filterMuscleGroup }: MuscleGroupModalProps) => {
  const { allMuscles } = useExercisesStore();
  const muscleGroupList: MuscleAndLabel[] = allMuscles
    ? [{ muscle: '', label: 'All Muscle Groups' }, ...allMuscles.map((muscle) => ({ muscle, label: muscle }))]
    : [{ muscle: '', label: 'All Muscle Groups' }];

  return (
    <ResponsiveModal
      open={groupDrawerOpen}
      onOpenChange={setGroupDrawerOpen}
      dismissable={true}
      title="Select Muscle Group"
      titleClassName="text-xl font-bold text-center"
    >
      <div className="flex flex-col flex-grow overflow-hidden">
        <ScrollArea type="always" className="flex-grow max-h-full h-96">
          <div className="p-4 space-y-2">
            {muscleGroupList.map((group, index) => (
              <Button
                key={index}
                className={`w-full ${currentMuscleGroup?.toLowerCase() === group.muscle.toLowerCase()
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-secondary-foreground'
                  }`}
                onClick={() => {
                  filterMuscleGroup(group.muscle);
                  setGroupDrawerOpen(false);
                }}
              >
                {group.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </ResponsiveModal>
  );
};

export default MuscleGroupModal;
