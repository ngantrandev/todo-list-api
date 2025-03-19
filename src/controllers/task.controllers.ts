import { Response } from 'express';

import { CustomRequest } from '@/types/requests';
import {
  convertTimezoneVN,
  executeQuery,
  isValidDateTime,
  isValidInteger,
  sendResponse,
} from '@/utils/utils';
import { StatusCodes } from 'http-status-codes';
import { Task } from '@/types/models';

export const getTasks = async (req: CustomRequest, res: Response) => {
  try {
    let { cursor, limit, search } = req.query;

    if (!cursor) {
      cursor = '0';
    }

    if (!limit) {
      limit = '10';
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
      LIMIT ?
    `;

    const tasks: Task[] = (await executeQuery(query, args)) as Task[];

    const newList = tasks.map(({ due_date, ...other }) => ({
      ...other,
      due_date: convertTimezoneVN(due_date),
    }));

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
