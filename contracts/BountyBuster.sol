pragma solidity ^0.4.18;

/** @title Bounty Buster. */
contract BountyBuster {
  // address of contract's owner
  address owner;

  // boolean for emergency stop
  bool public isStopped = false;

  // constructor sets owner to contract deployer
  constructor() public {
    owner = msg.sender;
  }

  enum TaskStatus { Posted, Completed }
  enum RequestStatus { Pending, Accepted, Rejected }

  struct Task {
    bytes title;
    address poster;
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

  // task added event allows for filtering by taskHash or poster
  event TaskAdded(bytes32 indexed taskHash, address indexed poster);

  // request added event allows for filtering by taskHash or requester
  event TaskRequested(bytes32 requestHash, bytes32 indexed taskHash, address indexed requester);

  mapping(bytes32 => Task) public tasks;
  mapping(bytes32 => Request) public requests;
  mapping(address => uint) public balances;

  // modifier which makes sure that contract is not stopped
  modifier mustNotBeStopped() {
    require(isStopped != true);
    _;
  }

  // modifier which makes sure task exists
  modifier taskMustExist(bytes32 _taskHash) {
    Task memory task = tasks[_taskHash];
    require(task.poster != address(0));
    _;
  }

  // modifier which makes sure user is not poster of the task
  modifier mustNotBePoster(bytes32 _taskHash) {
    Task memory task = tasks[_taskHash];
    require(task.poster != msg.sender);
    _;
  }

  // modifier which makes sure request exists
  modifier requestMustExist(bytes32 _requestHash) {
    Request memory request = requests[_requestHash];
    require(request.requester != address(0));
    _;
  }

  // modifier which makes sure user is poster of the task
  modifier mustBeTaskPoster(bytes32 _requestHash) {
    Request memory request = requests[_requestHash];
    Task memory task = tasks[request.taskHash];
    require(task.poster == msg.sender);
    _;
  }

  // modifier which makes sure user's balance is greater than 0
  modifier balanceMustBeGreaterThanZero() {
    require(balances[msg.sender] > 0);
    _;
  }

  // modifier which makes sure user is owner
  modifier mustBeOwner() {
    require(msg.sender == owner);
    _;
  }

  /** @dev Adds task.
  * @param _title Title of the task.
  * @param _description Description of the task.
  */
  function addTask(bytes _title, bytes _description)
  public
  payable
  mustNotBeStopped()
  {
    uint _createdAt = block.timestamp;
    Task memory newTask = Task({
      poster: msg.sender,
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
  mustNotBeStopped()
  mustNotBePoster(_taskHash)
  taskMustExist(_taskHash)
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

  /** @dev Accepts request.
  * @param _requestHash Hash of the request.
  */
  function acceptRequest(bytes32 _requestHash)
  public
  mustNotBeStopped()
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

  /** @dev Rejects request.
  * @param _requestHash Hash of the request.
  */
  function rejectRequest(bytes32 _requestHash)
  public
  mustNotBeStopped()
  requestMustExist(_requestHash)
  mustBeTaskPoster(_requestHash)
  {
    Request storage request = requests[_requestHash];
    request.status = RequestStatus.Rejected;
  }

  // @dev Cashes out user
  function cashOut()
  public
  payable
  balanceMustBeGreaterThanZero()
  {
    address user = msg.sender;
    uint balance = balances[user];
    user.transfer(balance);
    balances[user] = 0;
  }

  // @dev Pauses contract
  function pause()
  public
  mustBeOwner()
  {
    isStopped = true;
  }

  // @dev Resumes contract
  function resume()
  public
  mustBeOwner()
  {
    isStopped = false;
  }

  // @dev fallback function
  function()
  public
  payable
  {
    revert();
  }
}
