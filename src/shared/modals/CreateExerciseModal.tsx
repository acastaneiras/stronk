import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ResponsiveModal } from "@/shared/modals/ResponsiveModal";

type CreateExerciseModalProps = {
  createExerciseOpen: boolean;
  setCreateExerciseOpen: (open: boolean) => void;
};

const CreateExerciseModal = ({ createExerciseOpen, setCreateExerciseOpen }: CreateExerciseModalProps) => {
  return (
    <ResponsiveModal
      open={createExerciseOpen}
      onOpenChange={setCreateExerciseOpen}
      title="Create New Exercise"
      dismissable={true}
    >
      <div className="p-4">
        <Input placeholder="Exercise Name" className="mb-4" />

        <Select>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="mobility">Mobility</SelectItem>
            <SelectItem value="endurance">Endurance</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Muscle Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chest">Chest</SelectItem>
            <SelectItem value="back">Back</SelectItem>
            <SelectItem value="legs">Legs</SelectItem>
            <SelectItem value="shoulders">Shoulders</SelectItem>
            <SelectItem value="arms">Arms</SelectItem>
            <SelectItem value="core">Core</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Equipment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="barbell">Barbell</SelectItem>
            <SelectItem value="dumbbell">Dumbbell</SelectItem>
            <SelectItem value="machine">Machine</SelectItem>
            <SelectItem value="bodyweight">Bodyweight</SelectItem>
          </SelectContent>
        </Select>

        <Textarea placeholder="Instructions" className="mb-4 h-24" />
        <Button onClick={() => setCreateExerciseOpen(false)} className="w-full">
          Save
        </Button>
      </div>
    </ResponsiveModal>
  );
};

export default CreateExerciseModal;
