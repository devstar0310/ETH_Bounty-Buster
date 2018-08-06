import Web3Utils from 'web3-utils';

const REQUEST_PROPERTY_TO_INDEX = {
  requester: 0,
  taskHash: 1,
  message: 2,
  status: 3,
  createdAt: 4
};

const TaskStatusEnum = {
  SUBMITTED: 0,
  ACCEPTED: 1,
  REJECTED: 2,

  properties: {
    0: { displayName: 'Submitted' },
    1: { displayName: 'Accepted' },
    2: { displayName: 'Rejected' }
  }
};

class Request {
  constructor(requestHash, requestStruct) {
    this.hash = requestHash;
    this.requester = requestStruct[REQUEST_PROPERTY_TO_INDEX.requester];
    this.taskHash = requestStruct[REQUEST_PROPERTY_TO_INDEX.taskHash];
    this.message = Web3Utils.toAscii(requestStruct[REQUEST_PROPERTY_TO_INDEX.message]);
    this.status = TaskStatusEnum.properties[requestStruct[REQUEST_PROPERTY_TO_INDEX.status].toNumber()].displayName;
    this.createdAt = requestStruct[REQUEST_PROPERTY_TO_INDEX.createdAt].toNumber();
  }
}

export default Request;
