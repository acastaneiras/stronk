import { Button } from '@/components/ui/button'
import { SkipBackIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <main className="grid grid-rows-[1fr_auto] min-h-screen ">
      <div className="max-w-96 p-2 mx-auto w-full flex flex-col items-center justify-center">
        <div className='flex flex-col gap-4'>
          <h1 className='text-6xl text-bold text-center'>404</h1>
          <p className='text-center'>Page not found</p>
          <Button asChild>
            <Link to='/'><SkipBackIcon /> Go back to Home</Link>
          </Button>
        </div>
      </div>
    </main>

  )
}

export default NotFound