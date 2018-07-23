const BountyBuster = artifacts.require('./BountyBuster.sol');
const watchEvent = require('./helpers/watch-event');
const Web3Utils = require('web3-utils');

contract('BountyBuster', function(accounts) {

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const TASK_ADDED_EVENT = 'TaskAdded';
  const TASK_PROPERTY_TO_INDEX = { poster: 0, hunter: 1, reward: 2, description: 3 };

  it('should correctly emit a task added event with a task hash when a task is created', () => {

    let bountyBusterInstance;
    let taskReward = 100;
    let taskDescription = 'This is a task description';

    return BountyBuster
      .deployed()
      .then((instance) => {
        bountyBusterInstance = instance;
        return bountyBusterInstance.addTask(taskReward, taskDescription, { from: accounts[0] });
      })
      .then(() => {
        return watchEvent(bountyBusterInstance, TASK_ADDED_EVENT);
      })
      .then((taskAddedEvent) => {
        let taskHash = taskAddedEvent.args.taskHash;
        return bountyBusterInstance.tasks.call(taskHash);
      })
      .then((task) => {
        assert.equal(task[TASK_PROPERTY_TO_INDEX.poster], accounts[0]);
        assert.equal(task[TASK_PROPERTY_TO_INDEX.hunter], ZERO_ADDRESS);
        assert.equal(task[TASK_PROPERTY_TO_INDEX.reward].toNumber(), taskReward);
        assert.equal(Web3Utils.hexToUtf8(task[TASK_PROPERTY_TO_INDEX.description]), taskDescription);
      });
  });

});
