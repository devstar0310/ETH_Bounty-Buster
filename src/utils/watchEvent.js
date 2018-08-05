export default function watchEvent(contract, eventName, cb) {
  contract[eventName]().watch(cb);
}
