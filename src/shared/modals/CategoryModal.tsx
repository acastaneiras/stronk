import { Button } from '@/components/ui/button';
import { useExercisesStore } from '@/stores/exerciseStore';
import { ResponsiveModal } from './ResponsiveModal';

type Category = {
  category: string;
};

type CategoryModalProps = {
  categoryDrawerOpen: boolean;
  setCategoryDrawerOpen: (open: boolean) => void;
  currentCategory: string | null;
  filterCategory: (categoryName: string) => void;
};

const CategoryModal = ({ categoryDrawerOpen, setCategoryDrawerOpen, currentCategory, filterCategory }: CategoryModalProps) => {
  const { allCategories } = useExercisesStore();
  const categoryList = allCategories ? [{ category: 'All Categories' }, ...allCategories] as Category[] : null;

  return (
    <ResponsiveModal
      open={categoryDrawerOpen}
      onOpenChange={setCategoryDrawerOpen}
      dismissable={true}
      title="Select Category"
      titleClassName="text-xl font-bold text-center"
    >
      <div className="p-4 space-y-2">
        {categoryList && categoryList.map((category, index) => (
          <Button
            key={index}
            className={`w-full ${currentCategory === category.category
              ? 'bg-primary text-white'
              : 'bg-secondary text-secondary-foreground'
              }`}
            onClick={() => {
              filterCategory(category.category);
              setCategoryDrawerOpen(false);
            }}
          >
            {category.category}
          </Button>
        ))}
      </div>
    </ResponsiveModal>
  );
};

export default CategoryModal;