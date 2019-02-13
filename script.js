const { parseThread } = require('./parse');
const fs = require('fs');

const threadUrl = 'https://www.doomworld.com/forum/topic/70830-post-your-doom-picture-part-2/';
const startPage = 400;
const endPage = 420;
const delay = 1000 * 5;

parseThread(threadUrl, startPage, endPage, delay)
.then(results => {
    console.log(`script: finished parsing thread with results ${JSON.stringify(results)}`);
    fs.writeFile('results.json', JSON.stringify(results, null, 4), 'utf8', () => {
        console.log(`script: wrote results.json`);
    });
});