import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ImageIcon, CheckCircle2, LucideEllipsisVertical, Replace, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

const EditRoutine = () => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  return (
    <div className='flex flex-col gap-4'>
      <h1 className="text-5xl font-bold tracking-tighter ">Edit Routine</h1>
      <Input placeholder="Routine Name" value="Upper 1" />
      <div className='flex w-full gap-2'>
        <Button className='w-full'>Save</Button>
        <Button variant='destructive' className='w-full'>Cancel</Button>
      </div>
      <Separator />

      <div className='py-4'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row justify-between items-center gap-4'>
            <div className='flex flex-row items-center gap-4 w-full'>
              <ImageIcon className='w-12 h-12' />
              <div className='flex flex-col'>
                <span className='text-xl font-bold'>Bench Press</span>
                <div className='flex flex-col'>
                  <Badge className='w-min text-nowrap'>Strength</Badge>
                  <span className='text-sm'>Chest</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <LucideEllipsisVertical className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => alert('Redirect to Exercise List')}>
                    <Replace className="mr-2" />
                    <span>Change rest time</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert('Redirect to Exercise List')}>
                    <Replace className="mr-2" />
                    <span>Replace exercise</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowRemoveModal(true)}>
                    <Trash2 className="mr-2" />
                    <span>Remove exercise</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <div className='flex flex-row justify-between items-center gap-4'>
              <div className='flex flex-row gap-2 w-full justify-between'>
                <span className='text-md font-bold flex items-center gap-2'>
                  Set
                </span>
                <span className='text-md font-bold flex items-center gap-2'>
                  Weight
                </span>
                <span className='text-md font-bold flex items-center gap-2'>
                  Reps
                </span>
                <span className='text-md font-bold flex items-center gap-2'>
                  RPE
                </span>
                <span className='text-md font-bold flex items-center gap-2'>
                  Done
                </span>
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              {[...Array(3)].map((_, index) => (
                <div key={index} className='flex flex-row justify-between items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg'>
                  <span className='text-sm font-bold'>{index !== 2 ? index + 1 : <span className='text-red-500'>F</span>}</span>
                  <span className='text-sm font-bold'>100kg</span>
                  <span className='text-sm font-bold'>3</span>
                  <span className='text-sm font-bold'>8</span>
                  <CheckCircle2 size={24} className='text-green-600' />
                </div>
              ))}
            </div>
          </div>

          {/* Add Set Button */}
          <Button className='flex items-center justify-center gap-2 text-white'>
            Add Set
          </Button>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Exercise</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove this exercise?</p>
          <DialogFooter>
            <Button variant='destructive' onClick={() => {
              setShowRemoveModal(false);
              alert('Exercise Removed');
            }}>
              Confirm
            </Button>
            <Button variant='outline' onClick={() => setShowRemoveModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditRoutine
