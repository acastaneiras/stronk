import { Button } from '@/components/ui/button'
import { ResponsiveModal } from './ResponsiveModal'

type MuscleGroupModalProps = {
  groupDrawerOpen: boolean
  setGroupDrawerOpen: (open: boolean) => void
}

const MuscleGroupModal = ({groupDrawerOpen, setGroupDrawerOpen} : MuscleGroupModalProps) => {
  return (
    <ResponsiveModal
      open={groupDrawerOpen}
      onOpenChange={setGroupDrawerOpen}
      dismissable={true}
      title={`Select Muscle Group`}
      titleClassName='text-xl'
    >

      <div className="p-4">
        <Button className="w-full mb-2">Chest</Button>
        <Button className="w-full mb-2">Back</Button>
        <Button className="w-full mb-2">Legs</Button>
        <Button className="w-full mb-2">Shoulders</Button>
        <Button className="w-full mb-2">Arms</Button>
        ...
      </div>
    </ResponsiveModal>
  )
}

export default MuscleGroupModal