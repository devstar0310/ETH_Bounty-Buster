pragma solidity ^0.4.18;

contract BountyBuster {
  struct Task {
    address poster;
    address hunter;
    uint reward;
    bytes description;
  }

  mapping(bytes32 => Task) public tasks;

  event TaskAdded(bytes32 taskHash);

  function addTask(uint _reward, bytes _description)
  public
  payable
  {
    Task memory newTask = Task({
      poster: msg.sender,
      hunter: 0,
      reward: _reward,
      description: _description
    });
    bytes32 taskHash = keccak256(abi.encodePacked(newTask.poster, _reward, _description));
    tasks[taskHash] = newTask;
    emit TaskAdded(taskHash);
  }
}
