import { Card, CardContent } from "@/components/ui/card";
import { Exercise } from "@/models/Exercise";
import { getCategoryColor } from "@/utils/workoutUtils";
import clsx from "clsx";
import { CheckCircle, ImageIcon } from "lucide-react";
import { memo, useState } from "react";

const ExerciseListItem = ({ exercise, onPress, selected }: { exercise: Exercise; onPress: () => void; selected: boolean }) => {
  const [imageError, setImageError] = useState(false);
  const imgSource = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/refs/heads/main/exercises/${exercise.images?.[0]}`;

  return (
    <div
      onClick={onPress}
      className="cursor-pointer pb-4">
      <Card className={clsx("shadow-none bg-secondary/80", selected ? "border-primary" : "border-border")}>
        <CardContent className="flex flex-col items-start space-x-4 p-0">
          {exercise.category && (
            <div
              className="relative top-0 z-0 left-0 text-primary-foreground text-xs px-2 py-1 rounded-tl-xl rounded-br-lg"
              style={{ backgroundColor: getCategoryColor(exercise.category) }}>
              {exercise.category}
            </div>
          )}
          <div className="flex px-1 py-2 space-x-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {!imageError && imgSource ? (
                <img
                  src={imgSource}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <ImageIcon className="text-muted-foreground w-8 h-8" data-testid="image-icon" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {exercise.name} {exercise.equipment && `(${exercise.equipment})`}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">
                {exercise.primaryMuscles?.join(", ")}
              </p>
            </div>
          </div>
        </CardContent>
        {selected && (
          <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-b-lg gap-2 py-[0.1rem] border-border">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Selected</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default memo(ExerciseListItem);
