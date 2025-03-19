export interface User {
  user_id: number;
  username: string;
  password: string;
  email: string;
}

export interface Task {
  task_id: number;
  title: string;
  description: string;
  due_date: string;
  priority: number;
  user_id: number;
  status: number;
}
