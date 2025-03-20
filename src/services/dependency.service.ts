import { TaskDependency, TaskNode } from '@/types/models';

function findNode(list: TaskNode[], task: TaskNode) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].task_id === task.task_id) {
      return true;
    }
  }

  return false;
}

function dep_resolve(
  node: TaskNode,
  visited: TaskNode[],
  unFinished: TaskNode[]
) {
  console.log('start dep_resolve', node.task_id);
  unFinished.push(node);

  for (let parent of node.parents) {
    if (!findNode(visited, parent)) {
      if (findNode(unFinished, parent)) {
        unFinished.push(parent);

        throw new Error(unFinished.map((node) => node.task_id).join('-'));
      }

      dep_resolve(parent, visited, unFinished);
    }
  }

  visited.push(node);

  unFinished.forEach((item, index) => {
    if (item.task_id == node.task_id) {
      unFinished.splice(index, 1);
    }
  });
}

export const findCircular = (
  taskDependencies: TaskDependency[]
): string | undefined => {
  try {
    const listNode = getListNode(taskDependencies);

    for (let i = 0; i < listNode.length; i++) {
      const node = listNode[i];
      dep_resolve(node, [], []);
      return undefined;
    }
  } catch (error: any) {
    const circularStack = error.message as string;

    return circularStack;
  }
};

export const getListNode = (taskDependencies: TaskDependency[]): TaskNode[] => {
  const listNode: TaskNode[] = [];

  for (let i = 0; i < taskDependencies.length; i++) {
    const task = taskDependencies[i];

    let taskNode = listNode.find((node) => node.task_id === task.task_id);

    let parentNode = listNode.find(
      (node) => node.task_id === task.parent_task_id
    );

    if (!taskNode) {
      taskNode = { task_id: task.task_id, parents: [] };
      listNode.push(taskNode);
    }

    if (!parentNode) {
      parentNode = { task_id: task.parent_task_id, parents: [] };
      listNode.push(parentNode);
    }

    taskNode.parents.push(parentNode);
  }

  return listNode;
};
