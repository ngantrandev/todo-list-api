import express from 'express';
const taskRouter = express.Router();

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '@/controllers/task.controllers';

taskRouter.get('/get', getTasks);

taskRouter.post('/create', createTask);

taskRouter.put('/update', updateTask);

taskRouter.delete('/:task_id/delete', deleteTask);

export default taskRouter;
