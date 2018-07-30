import Web3Utils from 'web3-utils';

const TASK_PROPERTY_TO_INDEX = {
  title: 0,
  poster: 1,
  hunter: 2,
  reward: 3,
  description: 4,
  createdAt: 5
};

class Task {
  constructor(taskHash, taskStruct) {
    this.hash = taskHash;
    this.title = Web3Utils.toAscii(taskStruct[TASK_PROPERTY_TO_INDEX.title]);
    this.poster = taskStruct[TASK_PROPERTY_TO_INDEX.poster];
    this.hunter = taskStruct[TASK_PROPERTY_TO_INDEX.hunter];
    this.reward = taskStruct[TASK_PROPERTY_TO_INDEX.reward].toNumber().toString();
    this.description = Web3Utils.toAscii(taskStruct[TASK_PROPERTY_TO_INDEX.description]);
    this.createdAt = taskStruct[TASK_PROPERTY_TO_INDEX.createdAt].toNumber();
  }
}

export default Task;
