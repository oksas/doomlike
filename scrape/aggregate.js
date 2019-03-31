const fs = require('fs');

const resultFilenames = [
    'results_1-49.json',
    'results_50-99.json',
    'results_100-149.json',
    'results_150-199.json',
    'results_200-249.json',
    'results_250-399.json',
    'results_400-518.json'
];

const aggregateResults = resultFilenames.map(filename => {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
})
    .reduce((accumResults, currentResults) => {
        Object.keys(currentResults).forEach(authorName => {
            if (!accumResults[authorName]) {
                accumResults[authorName] = currentResults[authorName];
            } else {
                accumResults[authorName].totalLikes += currentResults[authorName].totalLikes;
                accumResults[authorName].posts = accumResults[authorName].posts.concat(currentResults[authorName].posts);
            }
        });

        return accumResults;
    });

const filename = 'results_agg.min.json';

fs.writeFileSync(filename, JSON.stringify(aggregateResults), 'utf8');
console.log(`wrote ${filename}`);
