import Web3Utils from 'web3-utils';

const TASK_PROPERTY_TO_INDEX = {
  title: 0,
  poster: 1,
  reward: 2,
  description: 3,
  status: 4,
  createdAt: 5
};

const TaskStatusEnum = {
  POSTED: 0,
  COMPLETED: 1,

  properties: {
    0: { displayName: 'Posted' },
    1: { displayName: 'Completed' }
  }
};

class Task {
  constructor(taskHash, taskStruct) {
    this.hash = taskHash;
    this.title = Web3Utils.toAscii(taskStruct[TASK_PROPERTY_TO_INDEX.title]);
    this.poster = taskStruct[TASK_PROPERTY_TO_INDEX.poster];
    this.reward = taskStruct[TASK_PROPERTY_TO_INDEX.reward].toNumber().toString();
    this.description = Web3Utils.toAscii(taskStruct[TASK_PROPERTY_TO_INDEX.description]);
    this.status = TaskStatusEnum.properties[taskStruct[TASK_PROPERTY_TO_INDEX.status].toNumber()].displayName;
    this.createdAt = taskStruct[TASK_PROPERTY_TO_INDEX.createdAt].toNumber();
  }
}

export default Task;
