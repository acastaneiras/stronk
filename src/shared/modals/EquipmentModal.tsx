import { Button } from '@/components/ui/button';
import { useExercisesStore } from '@/stores/exerciseStore';
import { ResponsiveModal } from './ResponsiveModal';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type EquipmentAndLabel = {
  equipment: string;
  label: string;
};

type EquipmentModalProps = {
  equipmentDrawerOpen: boolean; setEquipmentDrawerOpen: (open: boolean) => void;
  currentEquipment: string | null; filterEquipment: (equipmentName: string) => void;
};

const EquipmentModal = ({ equipmentDrawerOpen, setEquipmentDrawerOpen, currentEquipment, filterEquipment }: EquipmentModalProps) => {
  const { allEquipment } = useExercisesStore();
  const equipmentList: EquipmentAndLabel[] = allEquipment
    ? [{ equipment: '', label: 'All Equipment' }, ...allEquipment.map((equipment) => ({ equipment, label: equipment }))]
    : [{ equipment: '', label: 'All Equipment' }];

  return (
    <ResponsiveModal open={equipmentDrawerOpen} onOpenChange={setEquipmentDrawerOpen} dismissable={true} title="Select Equipment" titleClassName="text-lg text-center font-semibold leading-none tracking-tight">
      <div className="flex flex-col flex-grow overflow-hidden">
        <ScrollArea type="always" className="flex-grow max-h-full h-96">
          <div className="p-4 space-y-2">
            {equipmentList.map((item, index) => (
              <Button
                key={index}
                className={`w-full hover:text-primary-foreground ${currentEquipment?.toLowerCase() === item.equipment.toLowerCase()
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-secondary-foreground'
                  }`}
                onClick={() => {
                  filterEquipment(item.equipment);
                  setEquipmentDrawerOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </ResponsiveModal>
  );
};

export default EquipmentModal;
