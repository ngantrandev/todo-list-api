import express from 'express';
const taskRouter = express.Router();

import {
  addParentTask,
  createTask,
  deleteTask,
  getTasks,
  removeParentTask,
  updateTask,
} from '@/controllers/task.controllers';

taskRouter.get('/get', getTasks);

taskRouter.post('/create', createTask);

taskRouter.put('/update', updateTask);

taskRouter.delete('/:task_id/delete', deleteTask);

taskRouter.post('/:task_id/add_parent_task', addParentTask);

taskRouter.delete('/:task_id/remove_parent_task', removeParentTask);

export default taskRouter;
