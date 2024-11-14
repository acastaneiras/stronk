export interface Exercise {
    id: string;
    guid: string | null;
    name: string;
    category: string | null;
    primary_muscles: string[] | null;
    secondary_muscles: string[] | null;
    equipment: string | null;
    description: string | null;
    instructions: string[] | null;
    images: string[] | null;
    isCustom: boolean;
    created_at: Date | null;
}
