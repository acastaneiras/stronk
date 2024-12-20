import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import InstallPWAButton from "@/shared/buttons/InstallPWAButton";
import { LogInIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/training'); //Redirect to the training page if the user is already signed in
    }
  }, [session, navigate]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-6">
      <img src="stronk-logo-white.svg" alt="Stronk Logo" className="my-8" />
      <p className="text-lg max-w-2xl mb-8">
        A simple application to help you track your fitness progress and stay on top of your goals.
      </p>
      <Button asChild>
        <Link to={`/sign-in`} className="flex items-center gap-3 px-6 py-3 transition-all">
          <LogInIcon size={20} />
          Get Started
        </Link>
      </Button>

      <InstallPWAButton />
    </div>

  );
}

export default Home;
