import { Button } from '@/components/ui/button';
import { useExercisesStore } from '@/stores/exerciseStore';
import { ResponsiveModal } from './ResponsiveModal';

type CategoryAndLabel = {
  category: string;
  label: string;
};

type CategoryModalProps = {
  categoryDrawerOpen: boolean; 
  setCategoryDrawerOpen: (open: boolean) => void;
  currentCategory: string | null; 
  filterCategory: (categoryName: string) => void;
};

const CategoryModal = ({ categoryDrawerOpen, setCategoryDrawerOpen, currentCategory, filterCategory }: CategoryModalProps) => {
  const { allCategories } = useExercisesStore();
  const categoryList: CategoryAndLabel[] = allCategories
    ? [{ category: '', label: 'All Categories' }, ...allCategories.map((category) => ({ category, label: category }))]
    : [{ category: '', label: 'All Categories' }];

  return (
    <ResponsiveModal open={categoryDrawerOpen} onOpenChange={setCategoryDrawerOpen} dismissable={true} title="Select Category" titleClassName="text-xl font-bold text-center">
      <div className="p-4 space-y-2">
        {categoryList.map((item, index) => (
          <Button
            key={index}
            className={`w-full hover:text-primary-foreground ${currentCategory?.toLowerCase() === item.category?.toLowerCase()
              ? 'bg-primary text-white'
              : 'bg-secondary text-secondary-foreground'
              }`}
            onClick={() => {
              filterCategory(item.category);
              setCategoryDrawerOpen(false);
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </ResponsiveModal>
  );
};

export default CategoryModal;
