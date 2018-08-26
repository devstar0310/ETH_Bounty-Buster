### Integer Overflow
To avoid this integer overflow when transferring the reward of a task, I make sure
that the sum of the requester's balance plus the reward is greater than the balance.
In code, it looks like the following:

```
require(balances[request.requester] + task.reward >= balances[request.requester]);
```

If this fails, the transaction will revert.

### DoS
To avoid a malicious poster, I implement a pull payment system, where the user
cashes out their balance. The transfer of funds does not happen when a request
is accepted but when the user cashes out.
