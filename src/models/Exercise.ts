export interface Exercise {
    id: string;
    guid: string | null;
    name: string;
    category: string | null;
    primaryMuscles: string[] | null;
    secondaryMuscles: string[] | null;
    equipment: string | null;
    instructions: string[] | null;
    images: string[] | null;
    isCustom: boolean;
    createdAt: Date | null;
}
