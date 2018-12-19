const { parseThread } = require('./parse');
const fs = require('fs');

const threadUrl = 'https://www.doomworld.com/forum/topic/70830-post-your-doom-picture-part-2/';
const startPage = 491;
const endPage = 492;

parseThread(threadUrl, startPage, endPage)
.then(results => {
    console.log(`script: finished parsing thread with results ${JSON.stringify(results)}`);
    fs.writeFile('results.json', JSON.stringify(results), 'utf8', () => {
        console.log(`script: wrote results.json`);
    });
});