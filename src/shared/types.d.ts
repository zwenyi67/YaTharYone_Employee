export type APIResponse<T> = {
  message: string;
  status: number; // 0 is success
  data: T;
};

export type TimeChoiceType = {
  value: string;
  text: string;
};

export interface TimeStamps {
  created_at: string;
  updated_at: string;
}
