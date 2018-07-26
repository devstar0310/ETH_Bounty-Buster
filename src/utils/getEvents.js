export default function getEvents(contract, eventName) {
  // if (eventName) {
  //   return new Promise((resolve, reject) => {
  //     contract[eventName]()
  //       .get((error, events) => {
  //         if (error) {
  //           reject(error);
  //         }
  //         resolve(events);
  //       });
  //   });
  // }
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
