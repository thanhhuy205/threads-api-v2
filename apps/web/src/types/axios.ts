export type PromiseHandlers = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};
export type ApiError = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};