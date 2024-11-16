import { Dumbbell, UserIcon } from "lucide-react"
import { Link } from "react-router-dom"

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-around bg-background shadow-t dark:bg-background dark:shadow-t-gray-800 border-t">
      <Link
        to="/training"
        className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-primary focus:text-primary dark:text-primary-foreground/80 dark:hover:text-primary-foreground dark:focus:text-primary-foreground"
      >
        <Dumbbell className="h-6 w-6" />
        <span className="text-xs">Training</span>
      </Link>
      <Link
        to="/profile"
        className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-primary focus:text-primary dark:text-primary-foreground/80 dark:hover:text-primary-foreground dark:focus:text-primary-foreground"

      >
        <UserIcon className="h-6 w-6" />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  )
}
