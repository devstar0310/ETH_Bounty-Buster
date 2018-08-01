export default function getEvents(contract, eventName, filter) {
  if (eventName) {
    return new Promise((resolve, reject) => {
      contract[eventName](filter, { fromBlock: 0, toBlock: 'latest' })
        .get((error, events) => {
          if (error) {
            reject(error);
          }
          resolve(events);
        });
    });
  }
  return new Promise((resolve, reject) => {
    contract.allEvents()
      .get((error, events) => {
        if (error) {
          reject(error);
        }
        resolve(events);
      });
  });
}
