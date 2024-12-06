import { useWorkoutStore } from "@/stores/workoutStore";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const WorkoutRoutes = () => {
  const { emptyEditWorkout, isEditing } = useWorkoutStore();
  const location = useLocation();

  useEffect(() => {
    /*const shouldRunEffect =
      (location.pathname.startsWith("/training") || location.pathname.startsWith("/profile")) &&
      ![
        "/training/edit-workout",
        "/training/reorder-exercises",
        "/training/exercise-list",
        "/training/create-routine",
        "/training/edit-routine",
      ].includes(location.pathname);
    //Prevent emptying the workout when the user is editing it, and clear the workout when the user is not editing it
    if (shouldRunEffect && isEditing) {
      emptyEditWorkout();
    }*/
  }, [location.pathname, isEditing, emptyEditWorkout]);

  return <Outlet />;
};

export default WorkoutRoutes;
