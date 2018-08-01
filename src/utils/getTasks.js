import getEvents from './getEvents';
import Task from './Task';
import { Map } from 'immutable';

export default function getTasks(bountyBuster, filter = {}) {
  let taskAddedEvents;
  return getEvents(bountyBuster, 'TaskAdded', filter)
    .then((result) => {
      taskAddedEvents = result;
      return Promise.all(taskAddedEvents.map((taskAddedEvent) => {
        let { taskHash } = taskAddedEvent.args;
        return bountyBuster.tasks.call(taskHash);
      }));
    })
    .then((taskStructs) => {
      let tasksMap = {};
      taskStructs.forEach((taskStruct, index) => {
        let task = new Task(taskAddedEvents[index].args.taskHash, taskStruct);
        tasksMap[task.hash] = task;
      });
      return Map(tasksMap);
    });
}
