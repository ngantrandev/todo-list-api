import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomRequest } from '@/types/requests';
import {
  convertTimezoneVN,
  executeQuery,
  generateRedisKey,
  isValidDateTime,
  isValidInteger,
  selectData,
  sendResponse,
} from '@/utils/utils';
import { Task, TaskDependency } from '@/types/models';
import { findCircular } from '@/services/dependency.service';
import client from '@/configs/redis.config';

export const getTasks = async (req: CustomRequest, res: Response) => {
  try {
    let { cursor, limit, search } = req.query;

    if (!cursor) {
      cursor = '0';
    }

    if (!limit) {
      limit = '10';
    }

    /**
     * CHECK IN REDIS CACHE
     */

    const cacheKey = generateRedisKey({
      user_id: req.tokenPayload?.user_id,
      cursor: cursor,
      limit: limit,
      search: search,
    });

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      sendResponse(
        res,
        StatusCodes.OK,
        'get tasks successfully',
        JSON.parse(cachedData)
      );
      return;
    }

    const wheres = [];
    const args = [];

    if (!isValidInteger(cursor as string)) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'cursor must be an integer');
      return;
    }

    if (!isValidInteger(limit as string)) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'limit must be an integer');
      return;
    }

    if (search && search.toString().trim().length > 0) {
      const searchValue = search.toString().trim();

      if (searchValue[0] == '#') {
        const id = searchValue.slice(1);

        if (!isValidInteger(id)) {
          sendResponse(res, StatusCodes.BAD_REQUEST, 'id must be an integer');
          return;
        }

        wheres.push(`task_id = ?`);
        args.push(Number(id));
      } else {
        wheres.push(`title LIKE '%${searchValue}%'`);
      }
    } else {
      wheres.push(`task_id > ?`);
      args.push(Number(cursor));
    }

    wheres.push(`user_id = ?`);
    args.push(req.tokenPayload?.user_id);

    args.push(Number(limit));

    const query = `
      SELECT * 
      FROM tasks 
      WHERE ${wheres.join(' AND ')}
      ORDER BY due_date
      LIMIT ?
    `;

    const tasks: Task[] = (await executeQuery(query, args)) as Task[];

    const newList: Task[] = tasks.map(({ due_date, ...other }) => ({
      ...other,
      due_date: convertTimezoneVN(due_date),
    }));

    /**
     * SAVE TO REDIS CACHE
     */

    await client.setEx(cacheKey, 60, JSON.stringify(newList));

    sendResponse(res, StatusCodes.OK, 'get tasks successfully', newList);
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error' + err
    );
  }
};

export const createTask = async (req: CustomRequest, res: Response) => {
  try {
    const requiredFields = ['title', 'due_date', 'priority'];

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      const value = req.body[field];

      if (!value) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          `Missing required field: ${field}`
        );

        return;
      } else if (field == 'priority' && !isValidInteger(value)) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          field + ' must be an integer'
        );

        return;
      } else if (field == 'due_date' && !isValidDateTime(value)) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          field + ' must be a valid date time YYYY-MM-DD HH:MM'
        );

        return;
      }
    }

    const query = `INSERT INTO tasks (title, description, due_date, priority, user_id, status) VALUES (?, ?, ?, ?, ?, 0)`;

    await executeQuery(query, [
      req.body.title,
      req.body.description,
      req.body.due_date,
      req.body.priority,
      req.tokenPayload?.user_id,
    ]);

    sendResponse(res, StatusCodes.OK, 'Task created successfully');
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error'
    );
  }
};

export const updateTask = async (req: CustomRequest, res: Response) => {
  try {
    const requiredFields = [
      'title',
      'due_date',
      'priority',
      'status',
      'task_id',
    ];

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];

      const value = req.body[field];

      if (!value) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          `Missing required field: ${field}`
        );

        return;
      } else if (field == 'priority' && !isValidInteger(value)) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          field + ' must be an integer'
        );

        return;
      } else if (field == 'due_date' && !isValidDateTime(value)) {
        sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          field + ' must be a valid date time YYYY-MM-DD HH:MM'
        );

        return;
      }
    }

    const query = `UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE task_id = ? AND user_id = ?`;

    await executeQuery(query, [
      req.body.title,
      req.body.description,
      req.body.due_date,
      req.body.priority,
      req.body.status,
      req.body.task_id,
      req.tokenPayload?.user_id,
    ]);

    sendResponse(res, StatusCodes.OK, 'task updated successfully');
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error'
    );
  }
};

export const deleteTask = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.params.task_id) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'missing task_id param');
      return;
    }

    if (!isValidInteger(req.params.task_id)) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'task id must be interger');
      return;
    }

    await executeQuery(`DELETE FROM tasks WHERE task_id = ? AND user_id = ?`, [
      req.params.task_id,
      req.tokenPayload?.user_id,
    ]);

    await executeQuery(
      `DELETE FROM task_dependencies WHERE task_id = ? OR parent_task_id = ?`,
      [req.params.task_id, req.params.task_id]
    );

    sendResponse(res, StatusCodes.OK, 'task deleted successfully');
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error' + err
    );
  }
};

export const addParentTask = async (req: CustomRequest, res: Response) => {
  try {
    const { task_id } = req.params;

    if (!task_id) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'missing task_id param');
      return;
    }

    if (!isValidInteger(task_id)) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'task id must be interger');
      return;
    }

    if (!req.body.parent_task_id) {
      sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'missing parent_task_id field'
      );
      return;
    }

    if (!isValidInteger(req.body.parent_task_id)) {
      sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'parent_task_id must be interger'
      );
      return;
    }

    /**
     * CHECK IF EXIST CIRCULAR DEPENDENCY WITH NEW PARENT
     */

    const taskDependencies: TaskDependency[] = (await selectData(
      'SELECT * FROM task_dependencies',
      []
    )) as TaskDependency[];

    // IF WE ADD NEW PARENT TASK, WE NEED TO ADD THIS TO THE LIST
    const fakeTaskDependency = {
      task_id: Number(task_id),
      parent_task_id: Number(req.body.parent_task_id),
    };

    taskDependencies.push(fakeTaskDependency);

    const circularStack = findCircular(taskDependencies);

    if (circularStack) {
      const listCircular = circularStack.split('-').map((id) => Number(id));

      const result: Task[] = (await selectData(
        `SELECT * FROM tasks WHERE task_id IN (${listCircular.join(',')})`,
        listCircular
      )) as Task[];

      const newList = result.map(({ due_date, ...other }) => {
        return {
          ...other,
          due_date: convertTimezoneVN(due_date),
        };
      });

      sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'found circular dependencies',
        {
          stack: circularStack,
          tasks: newList,
        }
      );

      return;
    }

    const query = `INSERT INTO task_dependencies (task_id, parent_task_id) VALUES (?, ?)`;

    await executeQuery(query, [task_id, req.body.parent_task_id]);

    sendResponse(res, StatusCodes.OK, 'add parent task successfully');
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error' + err
    );
  }
};

export const removeParentTask = async (req: CustomRequest, res: Response) => {
  try {
    const { task_id } = req.params;

    if (!task_id) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'missing task_id param');
      return;
    }

    if (!isValidInteger(task_id)) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'task id must be interger');
      return;
    }

    if (!req.body.parent_task_id) {
      sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'missing parent_task_id field'
      );
      return;
    }

    if (!isValidInteger(req.body.parent_task_id)) {
      sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'parent_task_id must be interger'
      );
      return;
    }

    const query = `DELETE FROM task_dependencies WHERE task_id = ? AND parent_task_id = ?`;

    await executeQuery(query, [task_id, req.body.parent_task_id]);

    sendResponse(res, StatusCodes.OK, 'remove parent task successfully');
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error' + err
    );
  }
};

const findParent = async (taskId: number, list: Array<any>) => {
  const query = `
  SELECT
    tasks.*
  FROM task_dependencies
  INNER JOIN tasks ON task_dependencies.parent_task_id = tasks.task_id
  WHERE task_dependencies.task_id = ?`;
  const parentTasks: Task[] = (await executeQuery(query, [taskId])) as Task[];

  if (parentTasks.length === 0) {
    return;
  } else {
    parentTasks.forEach((task) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].task_id === task.task_id) {
          return;
        }
      }

      list.push(task);
    });

    for (let i = 0; i < parentTasks.length; i++) {
      const task = parentTasks[i];
      await findParent(task.task_id, list);
    }
  }
};

export const getParentTasks = async (req: CustomRequest, res: Response) => {
  try {
    const { task_id } = req.params;

    if (!task_id) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'missing task_id param');
      return;
    }

    if (!isValidInteger(task_id)) {
      sendResponse(res, StatusCodes.BAD_REQUEST, 'task id must be interger');
      return;
    }

    const cacheKey = generateRedisKey({
      key: 'parent_tasks',
      user_id: req.tokenPayload?.user_id,
      task_id: task_id,
    });

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      sendResponse(
        res,
        StatusCodes.OK,
        'get parent tasks successfully',
        JSON.parse(cachedData)
      );
      return;
    }

    const listParentTask: Array<any> = [];

    await findParent(Number(task_id), listParentTask);

    const newList = listParentTask.map(({ due_date, ...other }) => {
      return {
        ...other,
        due_date: convertTimezoneVN(due_date),
      };
    });

    await client.setEx(cacheKey, 60, JSON.stringify(newList));

    sendResponse(res, StatusCodes.OK, 'get parent tasks successfully', newList);
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error' + err
    );
  }
};

export const detectCircularDependency = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const taskDependencies: TaskDependency[] = (await selectData(
      `SELECT * FROM task_dependencies`,
      []
    )) as TaskDependency[];

    const circularStack = findCircular(taskDependencies);

    if (circularStack) {
      const listCircular = circularStack.split('-').map((id) => Number(id));

      const result: Task[] = (await selectData(
        `SELECT * FROM tasks WHERE task_id IN (${listCircular.join(',')})`,
        listCircular
      )) as Task[];

      const newList = result.map(({ due_date, ...other }) => {
        return {
          ...other,
          due_date: convertTimezoneVN(due_date),
        };
      });

      sendResponse(res, StatusCodes.OK, 'found circular dependencies', {
        stack: circularStack,
        tasks: newList,
      });

      return;
    }

    sendResponse(res, StatusCodes.OK, 'no circular dependencies found');
  } catch (err) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Internal Server Error' + err
    );
  }
};
