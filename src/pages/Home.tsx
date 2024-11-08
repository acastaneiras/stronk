import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="relative min-h-screen bg-[url('/gym_background.jpg')] bg-cover bg-center">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-6">
        <h1 className="text-6xl mb-4">Stronk</h1>
        <p className="text-lg max-w-2xl mb-8">
          Your personalized fitness companion to help you stay strong and achieve your goals. Join now and track your progress effortlessly.
        </p>
        <Button asChild>
          <Link to={`/sign-in`} className="flex items-center gap-3 px-6 py-3 transition-all">
            <LogInIcon size={20} />
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Home;
