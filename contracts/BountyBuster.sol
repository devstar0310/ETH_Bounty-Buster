pragma solidity ^0.4.18;

contract BountyBuster {
  enum TaskStatus {
    Posted,
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
  event TaskAdded(bytes32 indexed taskHash, address indexed poster);

  enum RequestStatus {
    Pending,
    Accepted,
    Rejected
  }
  struct Request {
    address requester;
    bytes32 taskHash;
    bytes message;
    RequestStatus status;
    uint created_at;
  }
  mapping(bytes32 => Request) public requests;
  event TaskRequested(bytes32 requestHash, bytes32 indexed taskHash, address indexed requester);

  function addTask(bytes _title, bytes _description)
  public
  payable
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
    tasks[taskHash] = newTask;
    emit TaskAdded(taskHash, msg.sender);
    return taskHash;
  }

  function submitRequest(bytes32 _taskHash, bytes _message)
  public
  {
    uint _createdAt = block.timestamp;
    Request memory newRequest = Request({
      requester: msg.sender,
      taskHash: _taskHash,
      message: _message,
      status: RequestStatus.Pending,
      created_at: _createdAt
    });
    bytes32 requestHash = keccak256(abi.encodePacked(msg.sender, _taskHash, _message, _createdAt));
    requests[requestHash] = newRequest;
    emit TaskRequested(requestHash, _taskHash, msg.sender);
  }

  function acceptRequest(bytes32 _requestHash)
  public
  payable
  {
    Request storage request = requests[_requestHash];
    Task storage task = tasks[request.taskHash];
    request.requester.transfer(task.reward);
    request.status = RequestStatus.Accepted;
    task.status = TaskStatus.Completed;
  }

  function rejectRequest(bytes32 _requestHash)
  public
  {
    Request storage request = requests[_requestHash];
    request.status = RequestStatus.Rejected;
  }
}
