import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
  id: string;
  name: string;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, name }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-row items-center justify-between gap-4 p-4 rounded-lg border bg-secondary shadow-md my-2"
    >
      <div className="flex flex-row items-center gap-4">
        <GripVertical className="cursor-move" />
        <span className="text-xl font-bold select-none">{name}</span>
      </div>
    </div>
  );
};
