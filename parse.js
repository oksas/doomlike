const request = require('request-promise-native');
const { JSDOM } = require('jsdom');

const parsePost = ($post) => {
    // authors can be 'invalid' if they are banned, which throws the structure of their post out of wack or something
    // I don't really care about those cases, so let's not bother handling it
    const isAuthorValid = !!$post.querySelector('.cAuthorPane_author a span');
    if (!isAuthorValid) {
        return null;
    }

    const author = $post.querySelector('.cAuthorPane_author a span').innerHTML;

    const likes = parseInt($post.querySelector('[data-role="reactCountText"]').innerHTML || 0, 10);

    console.log(`parsePost: parsed post by ${author} with ${likes} likes`);
    return { author, likes };
};

const parsePage = (url, delay) => {
    return new Promise((resolve, reject) => {
        console.log(`parsePage: waiting ${delay / 1000} seconds to make request...`);
        setTimeout(() => {
            console.log(`parsePage: making request...`);
            return request(url)
            .then(body => {
                const { document } = (new JSDOM(body)).window;

                const $posts = [...document.querySelectorAll('.cPost')];
                const postsResults = $posts.map($post => parsePost($post))
                    .filter(postData => {
                        return !!postData && postData.likes > 0
                    })
                    .reduce((allTotals, { author, likes }) => {
                        allTotals[author] = allTotals[author] || 0;
                        allTotals[author] += likes;
                        return allTotals;
                    }, {});

                console.log(`parsePage: parsed page with the following results: ${JSON.stringify(postsResults)}`);
                return postsResults;
            });
        }, delay);
    });
};

const parseThread = (threadUrl, startPage = 1, endPage = 1, delay = 1000 * 10) => {
    console.log(`parseThread: attempting to parse thread ${threadUrl} from page ${startPage} to ${endPage}`);

    const allPageUrls = [];
    const pageSuffix = '?page=';

    for (let i = startPage; i <= endPage; i++) {
        allPageUrls.push(threadUrl + pageSuffix + i);
    }

    console.log(`parseThread: all urls are ${allPageUrls}`);

    const allPageResults = allPageUrls.map(url => parsePage(url, delay));
    
    return Promise.all(allPageResults).then(allPageResults => {
        return allPageResults.reduce((allTotals, pageResults) => {
            for (let author in pageResults) {
                allTotals[author] = allTotals[author] || 0;
                allTotals[author] += pageResults[author];
            }
            return allTotals;
        }, {});
    });
};

module.exports = { parsePost, parsePage, parseThread };