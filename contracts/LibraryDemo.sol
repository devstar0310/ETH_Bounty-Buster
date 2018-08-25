pragma solidity ^0.4.18;

library TasksLibrary {
  enum TaskStatus { Posted, Completed }

  struct Task {
    bytes title;
    address poster;
    address hunter;
    uint reward;
    bytes description;
    TaskStatus status;
    uint created_at;
  }

  struct Data { mapping(bytes32 => Task) tasks; }

  function add(Data storage self, bytes _title, bytes _description)
  public
  returns (bytes32)
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
    bytes32 taskHash = keccak256(abi.encodePacked(msg.sender, _title, msg.value, _description, _createdAt));
    self.tasks[taskHash] = newTask;
    return taskHash;
  }
}
