// Pastebin jCxZg9kz
// Script by Brian Stack

let taskcluster = require('taskcluster-client');
let request = require('request');
let fs = require('fs');

let TASK_GROUP_ID = 'GasvOlwbQa65-rbvjThzmA';

async function main() {
  let queue = new taskcluster.Queue();

  let continuationToken;

  do {
    let group = await queue.listTaskGroup(TASK_GROUP_ID, continuationToken? {continuationToken} : {});
    continuationToken = group.continuationToken;
    group.tasks.forEach(async task => {
      let url = await queue.buildUrl(queue.getLatestArtifact, task.status.taskId, 'public/logs/live.log')
      console.log(url);
      let log = request({url: url, gzip: true})
        .on('error', function(err) {
          console.log('unable to fetch logs for ' + task.status.taskId);
          console.log(err)
        })
        .pipe(fs.createWriteStream("results/" + task.status.taskId))
    });
  } while (continuationToken)
}

main().then(console.log).catch(console.log);
