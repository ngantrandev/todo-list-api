import schedule from 'node-schedule';

import { ExpiringTaskType } from '@/types/models';
import { convertTimezoneVN, selectData, sendMail } from '@/utils/utils';

const runEveryHour = '0 * * * *';

const checkExpiringTasks = async () => {
  try {
    const TIME_TO_EXPIRE = 60 * 60000;
    const now = new Date();
    const nextFiveMinutes = new Date(now.getTime() + TIME_TO_EXPIRE);

    const query = `
    SELECT
      tasks.*,
      users.email,
      users.user_id
    FROM tasks
    INNER JOIN users ON tasks.user_id = users.user_id
    WHERE
      (due_date < ? OR (due_date BETWEEN ? AND ?))
      AND tasks.status = ?
      AND users.email IS NOT NULL
    GROUP BY tasks.due_date
    `;

    const tasks = (await selectData(query, [
      now,
      now,
      nextFiveMinutes,
      0,
    ])) as Array<ExpiringTaskType>;

    const myMap = new Map<number, ExpiringTaskType[]>();

    tasks.forEach((task) => {
      const userTasks = myMap.get(task.user_id) || [];
      userTasks.push(task);
      myMap.set(task.user_id, userTasks);
    });

    await sendNotificationMail(myMap);
  } catch (error) {
    console.log(error);
  }
};

const sendNotificationMail = async (
  expiringTaskMap: Map<number, ExpiringTaskType[]>
) => {
  for (const [_, tasks] of expiringTaskMap) {
    const email = tasks[0].email;
    const bodyHtml = `
      <h1>Bạn có ${tasks.length} công việc sắp hết hạn</h1>
      <ul>
        ${tasks
          .map((task) => {
            return `<li>${task.title} - ${convertTimezoneVN(
              task.due_date
            )}</li>`;
          })
          .join('')}
      </ul>
      </h1>
    `;

    await sendMail(email, 'Công việc sắp hết hạn', bodyHtml);
  }
};

schedule.scheduleJob(runEveryHour, async () => {
  await checkExpiringTasks();
});
