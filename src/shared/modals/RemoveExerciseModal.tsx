import { Button } from '@/components/ui/button';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import { Trash } from 'lucide-react';

const RemoveExerciseModal = ({ open, onOpenChange, onConfirmRemove }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirmRemove: () => void }) => (
  <ResponsiveModal
    open={open}
    onOpenChange={onOpenChange}
    dismissable={true}
    title="Remove Exercise"
    titleClassName="text-lg font-semibold leading-none tracking-tight"
    footer={
      <>
        <Button variant="destructive" onClick={onConfirmRemove}>
          <Trash /> Confirm
        </Button>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
      </>
    }
  >
    <p>Are you sure you want to remove this exercise?</p>
  </ResponsiveModal>
);

export default RemoveExerciseModal;