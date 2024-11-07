import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ImageIcon, LucideEllipsisVertical, CheckCircle2 } from 'lucide-react'

const CreateRoutine = () => {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className="text-5xl font-bold tracking-tighter ">Create Routine</h1>
      <Input placeholder="Routine Name" />
      <div className='flex w-full gap-2'>
        <Button className='w-full'>Save</Button>
        <Button variant='destructive' className='w-full'>Cancel</Button>
      </div>
      <Separator />

      <div className='py-4'>
        <div className='flex flex-col gap-4'>

          {/* Exercise card */}
          <div className='flex flex-row justify-between items-center gap-4'>
            <div className='flex flex-row items-center gap-4 w-full'>
              <ImageIcon className='w-12 h-12' />
              <div className='flex flex-col'>
                <span className='text-xl font-bold'>Exercise Name</span>
                <div className='flex flex-col'>
                  <Badge className='w-min text-nowrap'>Exercise Type</Badge>
                  <span className='text-sm'>Primary Muscle</span>
                </div>
              </div>
            </div>
            <LucideEllipsisVertical className='cursor-pointer' />
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
                  <span className='text-sm font-bold'>{index != 2 ? index + 1 : <span className='text-red-500'>F</span>}</span>
                  <span className='text-sm font-bold'>50kg</span>
                  <span className='text-sm font-bold'>10 </span>
                  <span className='text-sm font-bold'>10</span>
                  <CheckCircle2 size={24} className='text-green-600' />
                </div>
              ))}
            </div>
          </div>


          <Button className='flex items-center justify-center gap-2 text-white'>
            Add Set
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateRoutine