pragma solidity ^0.4.18;

/** @title Bounty Buster. */
contract BountyBuster {
  enum TaskStatus { Posted, Completed }
  enum RequestStatus { Pending, Accepted, Rejected }

  struct Task {
    bytes title;
    address poster;
    address hunter;
    uint reward;
    bytes description;
    TaskStatus status;
    uint created_at;
  }
  struct Request {
    address requester;
    bytes32 taskHash;
    bytes message;
    RequestStatus status;
    uint created_at;
  }

  event TaskAdded(bytes32 indexed taskHash, address indexed poster);
  event TaskRequested(bytes32 requestHash, bytes32 indexed taskHash, address indexed requester);

  mapping(bytes32 => Task) public tasks;
  mapping(bytes32 => Request) public requests;
  mapping(address => uint) public balances;

  /** @dev Adds task.
    * @param _title Title of the task.
    * @param _description Description of the task.
    */
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
    bytes32 taskHash = keccak256(abi.encodePacked(msg.sender, _title, msg.value, _description, _createdAt));
    tasks[taskHash] = newTask;
    emit TaskAdded(taskHash, msg.sender);
  }

  /** @dev Submits request for a task.
    * @param _taskHash Hash of the task.
    * @param _message Message containing work for task.
    */
  function submitRequest(bytes32 _taskHash, bytes _message)
  public
  {
    Task memory task = tasks[_taskHash];
    require(task.poster != msg.sender);
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

  modifier requestMustExist(bytes32 _requestHash) {
    Request memory request = requests[_requestHash];
    require(request.requester != address(0));
    _;
  }
  modifier mustBeTaskPoster(bytes32 _requestHash) {
    Request memory request = requests[_requestHash];
    Task memory task = tasks[request.taskHash];
    require(task.poster == msg.sender);
    _;
  }

  function acceptRequest(bytes32 _requestHash)
  public
  requestMustExist(_requestHash)
  mustBeTaskPoster(_requestHash)
  {
    Request storage request = requests[_requestHash];
    Task storage task = tasks[request.taskHash];
    require(balances[request.requester] + task.reward >= balances[request.requester]);
    balances[request.requester] += task.reward;
    request.status = RequestStatus.Accepted;
    task.status = TaskStatus.Completed;
  }

  function rejectRequest(bytes32 _requestHash)
  public
  requestMustExist(_requestHash)
  mustBeTaskPoster(_requestHash)
  {
    Request storage request = requests[_requestHash];
    request.status = RequestStatus.Rejected;
  }
}
