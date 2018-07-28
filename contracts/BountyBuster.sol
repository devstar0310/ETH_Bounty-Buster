pragma solidity ^0.4.18;

contract BountyBuster {
  struct Task {
    bytes title;
    address poster;
    address hunter;
    uint reward;
    bytes description;
    uint created_at;
  }

  mapping(bytes32 => Task) public tasks;

  event TaskAdded(bytes32 taskHash);

  function addTask(bytes _title, uint _reward, bytes _description)
  public
  payable
  {
    uint _createdAt = block.timestamp;
    Task memory newTask = Task({
      poster: msg.sender,
      hunter: 0,
      title: _title,
      reward: _reward,
      description: _description,
      created_at: _createdAt
    });
    bytes32 taskHash = keccak256(abi.encodePacked(newTask.poster, _title, _reward, _description, _createdAt));
    tasks[taskHash] = newTask;
    emit TaskAdded(taskHash);
  }
}
