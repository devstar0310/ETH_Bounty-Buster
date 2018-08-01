pragma solidity ^0.4.18;

contract BountyBuster {
  enum TaskStatus {
    Posted,
    Submitted,
    Completed
  }

  struct Task {
    bytes title;
    address poster;
    address hunter;
    uint reward;
    bytes description;
    TaskStatus status;
    uint created_at;
  }

  mapping(bytes32 => Task) public tasks;

  event TaskAdded(bytes32 taskHash, address indexed poster);

  function addTask(bytes _title, bytes _description)
  public
  payable
  {
    uint _createdAt = block.timestamp;
    Task memory newTask = Task({
      poster: msg.sender,
      hunter: 0,
      title: _title,
      reward: msg.value,
      description: _description,
      status: TaskStatus.Posted,
      created_at: _createdAt
    });
    bytes32 taskHash = keccak256(abi.encodePacked(newTask.poster, _title, msg.value, _description, _createdAt));
    tasks[taskHash] = newTask;
    emit TaskAdded(taskHash, msg.sender);
  }
}
