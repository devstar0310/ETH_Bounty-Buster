# bounty-buster

Bounty Buster is a marketplace for bounties. A user can post or complete tasks
with associated bounties. A poster can view his/her posted tasks and the submitted
requests for that task. The poster can accept or reject the requests. When a
request is accepted, the assigned bounty is sent to the requester.

### Running locally

1. Run your local blockchain with `ganache-cli`.
2. Copy your mnemonic phrase and unlock MetaMask.
3. Migrate the BountyBuster contract by running `truffle migrate`.
4. Run the front-end locally with `npm run start`.

### Using Bounty Buster

1. You will initially be directed to the dashboard, where you will see your
   tasks and requests.
2. Create a task by clicking the + icon and filling out the modal, for a task
   title, reward, and description. The reward will be used as the transaction
   value.
3. Confirm the transaction.
4. You will see your task will be added to the My Tasks table.
5. You can click on your task and view its information.
6. If you click the List icon in the sidebar, you will see all tasks that are posted
   on Bounty Buster.
7. Switch user accounts in MetaMask, and click on the task that was posted by the
   first account. As the second account, you will see a button on the top right of
   the page, which allows you to apply for the task. Click apply and submit the
   work for the task.
8. Confirm the transaction.
9. Navigate to the dashboard by clicking the home button in the sidebar.
10. You will see your request to the task posted by the first account.
11. Switch back to the first account in MetaMask.
12. Click the task.
13. You will notice that below the task information, a list of requests for that
    task is populated.
14. Click on the first request.
15. Click on the options on the top right. You can either accept or reject the task.
16. Accepting the task add to the requesters balance.
