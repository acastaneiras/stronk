import Footer from "@/shared/sections/Footer"
import { Button } from "@/components/ui/button"
import { LogInIcon } from "lucide-react"
import { Link } from "react-router-dom"
function Home() {

  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen">
      <div className="max-w-96 p-2 mx-auto w-full">
        <div className="flex flex-col gap-12 justify-center h-full">
          <h1 className='text-6xl text-bold text-center'>Stronk</h1>
          <p className='text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, praesentium unde voluptates sed rem fugit incidunt quos obcaecati dignissimos repudiandae aliquam, doloremque dolor soluta iste eaque nesciunt. Nesciunt, debitis velit.</p>
          <div className="text-center">
            <Button asChild>
              <Link to={`/sign-in`} className='flex w-full justify-center gap-3'>
                <LogInIcon size={20} />
                Access
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
