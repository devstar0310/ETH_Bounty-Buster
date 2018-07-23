module.exports = function watchEvent(contract, eventName) {
  return new Promise((resolve, reject) => {
    let event = contract[eventName]();
    event.watch((error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}
