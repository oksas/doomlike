const { parseThread } = require('./parse');

const threadUrl = 'https://www.doomworld.com/forum/topic/70830-post-your-doom-picture-part-2/';
const startPage = 1;
const endPage = 5;

parseThread(threadUrl, startPage, endPage)
.then(results => {
    console.log(`script: finished parsing thread with results ${JSON.stringify(results)}`);
});