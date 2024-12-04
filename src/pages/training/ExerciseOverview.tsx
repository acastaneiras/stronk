import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'

const CreateNewWorkout = () => {

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <div className='w-10'>
          <ChevronLeft className="cursor-pointer" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter w-full text-center mr-10 ">Exercise Overview</h1>
      </div>
      <h1 className="text-3xl font-bold tracking-tighter ">Exercise Name</h1>
      <div className='flex flex-col'>
        <Badge className='w-min text-nowrap'>Strength</Badge>
        <span className='text-sm'>Primary Muscles: X, Y, Z</span>
        <span className='text-sm'>Secondary Muscles: A, B, C</span>
      </div>
      <div className='flex flex-row text-center justify-center h-32 items-center border-2 rounded'>
        Exercise Image
      </div>
      <h1 className='text-lg font-bold tracking-tighter'>Instructions</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      <div className='flex flex-row text-center justify-center h-32 items-center border-2 rounded'>
        Chart
      </div>

      <div className='py-4 flex-col'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-lg font-bold tracking-tighter'>Records</h1>
          <ul>
            <li><strong>Maximum weight lifted</strong>: Xkg</li>
            <li><strong>Best set volume</strong>: Xkg x X reps</li>
          </ul>
        </div>
      </div>
      <div className='py-4 flex-col'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-lg font-bold tracking-tighter'>History</h1>
          <div className='flex flex-col'>
            <div className='grid grid-cols-2 border-b pb-2'>
              <h1 className='text-xl font-bold text-left'>Reps</h1>
              <h1 className='text-xl font-bold text-left'>Weight</h1>
            </div>
            <div className='grid grid-cols-2 py-2 border-b'>
              <span className='text-xl text-left'>5</span>
              <span className='text-xl text-left'>45kg</span>
            </div>
            <div className='grid grid-cols-2 py-2 border-b'>
              <span className='text-xl text-left'>8</span>
              <span className='text-xl text-left'>50kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNewWorkout
