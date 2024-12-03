export type Column = {
  id: string | number;
  title: string;
};

export type Task = {
  id: string | number;
  content: string;
  columnId: string | number;
};
