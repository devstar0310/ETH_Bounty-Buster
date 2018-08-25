### Events
The first obstacle was to figure out how to display all tasks that have been posted
to BountyBuster to a user. Since the tasks are stored in a mapping, which maps
a task identifier to a task, I need a way to get all task identifiers that exist
in the mapping. So, anytime a task is created, an event is emitted with a task identifier
and the address of the task poster. This allows a user to get all events that
are of type `TaskAdded`, get the task identifier for each, and get the task associated
with that identifier from the public mapping of tasks. Emitting the event with the
address of the poster, also allows for getting tasks that were created for a specific
user. The same applies for task requests. For `TaskRequested` events, I also emit
the hash of the task, that way, when a user is looking at a task that was created,
I can easily find all requests that belong to that task.

### Data Structures
I use mappings for tasks, requests, and balances. Being able to directly access
a task, request, or balance using a task or request identifier or an address
seems to be the most straightforward way of manipulating data. I use structs to
define tasks and requests, with properties and values. I use enums for statuses
of tasks and requests.

### Validation
For request submission, I ensure that the task exists and that the requester is
not the poster. That would be a redundant operation. For accepting and rejecting
requests, I ensure that the request exists and that the user accepting or
rejecting is the task poster.
