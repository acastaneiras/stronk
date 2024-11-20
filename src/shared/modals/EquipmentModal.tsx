import { Button } from '@/components/ui/button'
import { ResponsiveModal } from './ResponsiveModal'

type EquipmentModalProps = {
  equipmentDrawerOpen: boolean
  setEquipmentDrawerOpen: (open: boolean) => void
}

const EquipmentModal = ({ equipmentDrawerOpen, setEquipmentDrawerOpen }: EquipmentModalProps) => {
  return (
    <ResponsiveModal
      open={equipmentDrawerOpen}
      onOpenChange={setEquipmentDrawerOpen}
      dismissable={true}
      title={`Select Equipment`}
      titleClassName='text-xl'
    >
      <div className="p-4">
        <Button className="w-full mb-2">Barbell</Button>
        <Button className="w-full mb-2">Dumbbell</Button>
        <Button className="w-full mb-2">Machine</Button>
        <Button className="w-full mb-2">Bodyweight</Button>
        ...
      </div>
    </ResponsiveModal>
  )
}

export default EquipmentModal