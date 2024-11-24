import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "./ResponsiveModal";
import { SetType } from "@/models/ExerciseSet";
import IconSet from "../icons/IconSet";

type SetTypeModalProps = {
  setTypeShown: boolean;
  setSetTypeShown: (open: boolean) => void;
  onChangeSetType: (setType: SetType) => void;
};

const SetTypeModal = ({ setTypeShown, setSetTypeShown, onChangeSetType }: SetTypeModalProps) => {
  const setTypes = Object.values(SetType);

  return (
    <ResponsiveModal
      open={setTypeShown}
      onOpenChange={setSetTypeShown}
      dismissable={true}
      title="Select Set Type"
      titleClassName="text-xl font-bold text-center"
    >
      <div className="p-4 space-y-2">
        {setTypes.map((type) => (
          <Button
            key={type}
            variant={`secondary`}
            className={`w-full flex items-center gap-x-4 hover:text-primary-foreground bg-secondary text-secondary-foreground`}
            onClick={() => {
              onChangeSetType(type);
              setSetTypeShown(false);
            }}
          >
            <IconSet setType={type}/>
            <span className="text-sm">{type}</span>
          </Button>
        ))}
      </div>
    </ResponsiveModal>
  );
};

export default SetTypeModal;
