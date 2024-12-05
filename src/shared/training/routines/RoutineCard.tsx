import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const RoutineCard = () => {
  return (
    <Card className='shadow-none relative'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle className='text-2xl'>Routine 1 Name</CardTitle>
            <CardDescription>X exercises</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <Button className='w-full'>Start Routine</Button>
      </CardFooter>
    </Card>
  )
}

export default RoutineCard