import { Button } from "@/components/ui/button";
import { WorkoutExerciseType } from "@/models/WorkoutExerciseType";
import { SortableItem } from "@/shared/SortableItem";
import { StoreMode, useWorkoutStore } from "@/stores/workoutStore";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ChevronLeft, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReorderItem {
  id: string;
  exercise: WorkoutExerciseType;
}

const ReorderExercises = () => {
  const { workout, routine, reorderExercises, storeMode, editingWorkout } = useWorkoutStore();
  const navigate = useNavigate();

  useEffect(() => {
    const exercises =
      storeMode === StoreMode.ROUTINE
        ? routine?.workout_exercises || []
        : storeMode === StoreMode.EDIT_WORKOUT
        ? editingWorkout?.workout_exercises || []
        : workout?.workout_exercises || [];
  
    const initialItems = exercises.map((exercise, index) => ({
      id: `${exercise.id.toString()}-${index}`,
      exercise: exercise,
    }));
    
    setItems(initialItems);
  }, [workout, routine, editingWorkout, storeMode]);

  const [items, setItems] = useState<ReorderItem[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over!.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over!.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  const handleReorderExercises = () => {
    const reorderedExercises = items.map((item) => item.exercise);
    reorderExercises(reorderedExercises);
    navigate(-1);
  }

  return (
    <main className="min-h-screen flex flex-col ">
      <div className="flex-grow flex flex-col w-full max-w-full lg:max-w-screen-lg mx-auto px-4 py-0">
        <div className="flex flex-col flex-grow h-full">
          <div className="flex flex-row items-center justify-between p-4 bg-background sticky top-0 border-b border-border">
            <div className="w-10 cursor-pointer">
              <button onClick={() => navigate(-1)} className="p-1">
                <ChevronLeft />
              </button>
            </div>
            <h1 className="text-xl font-bold tracking-tighter w-full text-center mr-10">
              Reorder Exercises
            </h1>
          </div>
          <div className="flex flex-col py-4">
            {items.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  {items.map((item) => (
                    <SortableItem key={item.id} id={item.id} name={item.exercise.exercise.name} />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="flex items-center justify-center h-full">
                <h2 className="text-lg">No exercises to reorder</h2>
              </div>
            )}

          </div>
        </div>
      </div>
      <div className="sticky bottom-safe left-0 w-full bg-background text-center p-4 border-t border-border">
        <div className="flex flex-row items-center max-w-screen-lg mx-auto gap-4">
          <Button className='w-full' onClick={handleReorderExercises}>
            <SaveIcon />
            Save order
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ReorderExercises;
