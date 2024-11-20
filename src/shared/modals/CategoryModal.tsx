import { Button } from '@/components/ui/button'
import { ResponsiveModal } from './ResponsiveModal'

type CategoryModalProps = {
  categoryDrawerOpen: boolean
  setCategoryDrawerOpen: (open: boolean) => void
}

const CategoryModal = ({ categoryDrawerOpen, setCategoryDrawerOpen }: CategoryModalProps) => {
  return (
    <ResponsiveModal
      open={categoryDrawerOpen}
      onOpenChange={setCategoryDrawerOpen}
      dismissable={true}
      title={`Select category`}
      titleClassName='text-xl'
    >
      <div className="p-4">
        <Button className="w-full mb-2">Strength</Button>
        <Button className="w-full mb-2">Cardio</Button>
        <Button className="w-full mb-2">Mobility</Button>
        <Button className="w-full mb-2">Endurance</Button>
        ...
      </div>
    </ResponsiveModal>
  )
}

export default CategoryModal