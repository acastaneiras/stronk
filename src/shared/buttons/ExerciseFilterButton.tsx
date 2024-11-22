import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { X } from 'lucide-react'

type ExerciseFilterButtonProps = {
  filter: string | null;
  filterColor?: string;
  icon: React.ReactNode;
  onClose: () => void;
};
const ExerciseFilterButton = ({ filter, filterColor, icon, onClose }: ExerciseFilterButtonProps) => {
  return (
    <Badge
      variant="outline"
      className={clsx(
        'border justify-around flex flex-row',
        { 'border-primary': !filterColor }
      )}
      style={filterColor ? { borderColor: filterColor } : {}}
    >
      <div className='flex flex-row gap-2 items-center'>
        {icon}
        <span className="text-sm font-medium capitalize"
        >{filter}</span>
      </div>
      <Button
        variant="link"
        size="icon"
        onClick={onClose}
        className="text-foreground"
      >
        <X className='h-4 w-4' />
      </Button>
    </Badge>
  )
}

export default ExerciseFilterButton