const { parseThread } = require('./parse');

const threadUrl = 'https://www.doomworld.com/forum/topic/70830-post-your-doom-picture-part-2/';
const pageCount = 1;

parseThread(threadUrl, pageCount)
.then(results => {
    console.log(`script: finished parsing thread with results ${JSON.stringify(results)}`);
});