const BountyBuster = artifacts.require('./BountyBuster.sol');
const watchEvent = require('./helpers/watch-event');
const Web3Utils = require('web3-utils');
const errorHandling = require('./helpers/error-handling');

contract('BountyBuster', function(accounts) {
  const TASK_ADDED_EVENT = 'TaskAdded';
  const TASK_REQUESTED_EVENT = 'TaskRequested';

  const TASK_PROPERTY_TO_INDEX = {
    title: 0,
    poster: 1,
    reward: 2,
    description: 3,
    status: 4,
    createdAt: 5
  };

  const REQUEST_PROPERTY_TO_INDEX = {
    requester: 0,
    taskHash: 1,
    message: 2,
    status: 3,
    createdAt: 4
  };

  const TASK_STATUS_ENUM = {
    posted: 0,
    completed: 1
  };

  const REQUEST_STATUS_ENUM = {
    pending: 0,
    accepted: 1,
    rejected: 2
  };

  const taskTitle = 'A task title';
  const taskReward = '10';
  const taskDescription = 'This is a task description';

  const requestMessage = 'This is completed work';

  let bountyBusterInstance, testTaskHash, testRequestHash;

  beforeEach('setup contract for each test', async () => {
    bountyBusterInstance = await BountyBuster.deployed();
  });

  it('should correctly emit a task added event with a task hash and poster address when a task is created', async () => {
    await bountyBusterInstance.addTask(taskTitle, taskDescription, { from: accounts[0], value: Web3Utils.toWei(taskReward, 'ether') });
    let taskAddedEvent = await watchEvent(bountyBusterInstance, TASK_ADDED_EVENT);
    let { taskHash, poster } = taskAddedEvent.args;
    testTaskHash = taskHash;
    assert.ok(taskHash);
    assert.equal(poster, accounts[0]);
  });

  it('should correctly store a task', async () => {
    let task = await bountyBusterInstance.tasks.call(testTaskHash);
    assert.equal(Web3Utils.hexToUtf8(task[TASK_PROPERTY_TO_INDEX.title]), taskTitle);
    assert.equal(task[TASK_PROPERTY_TO_INDEX.poster], accounts[0]);
    assert.equal(Web3Utils.fromWei(task[TASK_PROPERTY_TO_INDEX.reward].toNumber().toString(), 'ether'), taskReward);
    assert.equal(Web3Utils.hexToUtf8(task[TASK_PROPERTY_TO_INDEX.description]), taskDescription);
  });

  it('should correctly transfer task rewards to the contract', async () => {
    let contractBalance = await web3.eth.getBalance(bountyBusterInstance.address);
    assert.equal(Web3Utils.fromWei(contractBalance.toNumber().toString(), 'ether'), taskReward);
  });

  it('should correctly emit a task requested event with a request and task hash and requester address when a request is made', async () => {
    await bountyBusterInstance.submitRequest(testTaskHash, requestMessage, { from: accounts[1] });
    let taskRequestedEvent = await watchEvent(bountyBusterInstance, TASK_REQUESTED_EVENT);
    let { requestHash, taskHash, requester } = taskRequestedEvent.args;
    testRequestHash = requestHash;
    assert.ok(requestHash);
    assert.equal(taskHash, testTaskHash);
    assert.equal(requester, accounts[1]);
  });

  it('should correctly store a request', async () => {
    let request = await bountyBusterInstance.requests.call(testRequestHash);
    assert.equal(request[REQUEST_PROPERTY_TO_INDEX.requester], accounts[1]);
    assert.equal(request[REQUEST_PROPERTY_TO_INDEX.taskHash], testTaskHash);
    assert.equal(Web3Utils.hexToUtf8(request[REQUEST_PROPERTY_TO_INDEX.message]), requestMessage);
    assert.equal(request[REQUEST_PROPERTY_TO_INDEX.status], REQUEST_STATUS_ENUM.pending);
  });

  it('should not allow a poster of a task to submit a request for that task', async () => {
    try {
      await bountyBusterInstance.submitRequest(testTaskHash, requestMessage, { from: accounts[0] });
    } catch(err) {
      assert.ok(errorHandling.isOfTypeRevert(err));
    }
  });

  it('should revert accepting a request if the request does not exist', async () => {
    let randomRequestHash = Web3Utils.toHex(Math.floor(Math.random() * 1000));
    try {
      await bountyBusterInstance.acceptRequest(randomRequestHash, { from: accounts[0] });
    } catch(err) {
      assert.ok(errorHandling.isOfTypeRevert(err));
    }
  });

  it('should revert accepting a request if the user is not the poster', async () => {
    try {
      await bountyBusterInstance.acceptRequest(testRequestHash, { from: accounts[1] });
    } catch(err) {
      assert.ok(errorHandling.isOfTypeRevert(err));
    }
  });

  it('should revert rejecting a request if the request does not exist', async () => {
    let randomRequestHash = Web3Utils.toHex(Math.floor(Math.random() * 1000));
    try {
      await bountyBusterInstance.rejectRequest(randomRequestHash, { from: accounts[0] });
    } catch(err) {
      assert.ok(errorHandling.isOfTypeRevert(err));
    }
  });

  it('should revert rejecting a request if the user is not the poster', async () => {
    try {
      await bountyBusterInstance.rejectRequest(testRequestHash, { from: accounts[1] });
    } catch(err) {
      assert.ok(errorHandling.isOfTypeRevert(err));
    }
  });

  it('should update the status of a request if it has been rejected', async () => {
    await bountyBusterInstance.rejectRequest(testRequestHash, { from: accounts[0] });
    let request = await bountyBusterInstance.requests.call(testRequestHash);
    assert.equal(request[REQUEST_PROPERTY_TO_INDEX.status], REQUEST_STATUS_ENUM.rejected);
  });

  it('should update the requester\'s balance and the request and task statuses if the request is accepted', async () => {
    await bountyBusterInstance.acceptRequest(testRequestHash, { from: accounts[0] });
    let balanceOfRequester = await bountyBusterInstance.balances.call(accounts[1]);
    assert.equal(Web3Utils.fromWei(balanceOfRequester.toNumber().toString(), 'ether'), taskReward);

    let request = await bountyBusterInstance.requests.call(testRequestHash);
    assert.equal(request[REQUEST_PROPERTY_TO_INDEX.status], REQUEST_STATUS_ENUM.accepted);

    let task = await bountyBusterInstance.tasks.call(testTaskHash);
    assert.equal(task[TASK_PROPERTY_TO_INDEX.status], TASK_STATUS_ENUM.completed);
  });

  it('should allow a user to cash out', async () => {
    let originalBalanceOfRequesterAddress = await web3.eth.getBalance(accounts[1]);
    await bountyBusterInstance.cashOut({ from: accounts[1] });
    let currentBalanceOfRequesterAddress = await web3.eth.getBalance(accounts[1]);
    assert.ok(currentBalanceOfRequesterAddress > originalBalanceOfRequesterAddress);
  });

  it('should allow the owner to pause the contract', async () => {
    await bountyBusterInstance.pause({ from: accounts[0] });
    let isStopped = await bountyBusterInstance.isStopped.call();
    assert.equal(isStopped, true);
  });

  it('should allow the owner to resume the contract', async () => {
    await bountyBusterInstance.resume({ from: accounts[0] });
    let isStopped = await bountyBusterInstance.isStopped.call();
    assert.equal(isStopped, false);
  });

  it('should not allow a user that is not the owner to pause the contract', async () => {
    try {
      await bountyBusterInstance.pause({ from: accounts[1] });
    } catch(err) {
      assert.ok(errorHandling.isOfTypeRevert(err));
    }
  });

  it('should not allow a user that is not the owner to resume the contract', async () => {
    try {
      await bountyBusterInstance.resume({ from: accounts[1] });
    } catch(err) {
      assert.ok(errorHandling.isOfTypeRevert(err));
    }
  });
});
