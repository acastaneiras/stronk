
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function ImageCarousel({ images }: { images: string[] }) {
  return (
    <div className="relative w-full text-center flex items-center justify-center">
      <Carousel className="w-9/12 md:w-11/12 flex flex-row text-center justify-center items-center border-2 rounded">
        <CarouselContent>
          {images.map((_, index) => (
            <CarouselItem key={index}>
              <div className="">
                <img src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/refs/heads/main/exercises/${images[index]}`} alt={`Image ${index}`} className=" w-full h-full" onError={
                  (e) => {
                    e.currentTarget.src = "https://via.placeholder.com/500x500?text=No+Image"; //On error, set a placeholder image
                  }
                } />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}