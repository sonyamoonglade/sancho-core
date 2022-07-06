export type Mark = {
   id?: number;
   user_id: number;
   content: string;
   is_important: boolean;
   created_at: Date;
};

export const marks = "marks";
