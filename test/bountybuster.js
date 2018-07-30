const BountyBuster = artifacts.require('./BountyBuster.sol');
const watchEvent = require('./helpers/watch-event');
const Web3Utils = require('web3-utils');

contract('BountyBuster', function(accounts) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const TASK_ADDED_EVENT = 'TaskAdded';
  const TASK_PROPERTY_TO_INDEX = { title: 0, poster: 1, hunter: 2, reward: 3, description: 4, createdAt: 5 };
  const taskTitle = 'Suh';
  const taskReward = '10';
  const taskDescription = 'This is a task description';

  it('should correctly emit a task added event with a task hash when a task is created', () => {
    let bountyBusterInstance;

    return BountyBuster
      .deployed()
      .then((instance) => {
        bountyBusterInstance = instance;
        return bountyBusterInstance.addTask(taskTitle, taskDescription, { from: accounts[0], value: Web3Utils.toWei(taskReward, 'ether') });
      })
      .then(() => {
        return watchEvent(bountyBusterInstance, TASK_ADDED_EVENT);
      })
      .then((taskAddedEvent) => {
        let taskHash = taskAddedEvent.args.taskHash;
        return bountyBusterInstance.tasks.call(taskHash);
      })
      .then((task) => {
        assert.equal(Web3Utils.hexToUtf8(task[TASK_PROPERTY_TO_INDEX.title]), taskTitle);
        assert.equal(task[TASK_PROPERTY_TO_INDEX.poster], accounts[0]);
        assert.equal(task[TASK_PROPERTY_TO_INDEX.hunter], ZERO_ADDRESS);
        assert.equal(Web3Utils.fromWei(task[TASK_PROPERTY_TO_INDEX.reward].toNumber().toString(), 'ether'), taskReward);
        assert.equal(Web3Utils.hexToUtf8(task[TASK_PROPERTY_TO_INDEX.description]), taskDescription);
      });
  });

  it('should correctly transfer task rewards to the contract', () => {
    let bountyBusterInstance;

    return BountyBuster
      .deployed()
      .then((instance) => {
        return web3.eth.getBalance(instance.address)
      })
      .then((balance) => {
        assert.equal(Web3Utils.fromWei(balance.toNumber().toString(), 'ether'), taskReward);
      });
  });
});
