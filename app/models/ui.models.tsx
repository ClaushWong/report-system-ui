// interface

export interface IMessage {
  type?: "info" | "error" | "warning";
  message: string;
}

export interface IPagination {
  total?: number;
  pageSize: number | undefined;
  current: number | undefined;
}

// type

export type LoginCredentitals = {
  username: string;
  password: string;
};
