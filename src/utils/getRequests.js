import getEvents from './getEvents';
import Request from './Request';
import { Map } from 'immutable';

export default function getRequests(bountyBuster, filter = {}) {
  let taskRequestedEvents;
  return getEvents(bountyBuster, 'TaskRequested', filter)
    .then((result) => {
      taskRequestedEvents = result;
      return Promise.all(taskRequestedEvents.map((taskRequestedEvent) => {
        let { requestHash } = taskRequestedEvent.args;
        return bountyBuster.requests.call(requestHash);
      }));
    })
    .then((RequestStructs) => {
      let RequestsMap = {};
      RequestStructs.forEach((RequestStruct, index) => {
        let request = new Request(taskRequestedEvents[index].args.requestHash, RequestStruct);
        RequestsMap[request.hash] = request;
      });
      return Map(RequestsMap);
    });
}
