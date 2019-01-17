const request = require('request-promise-native');
const { JSDOM } = require('jsdom');
const {
    getPostAuthor,
    getPostLikes,
    filterEmptyPostData,
    filterLikelessPostData,
    sumAuthorLikes
    } = require('./reducers');

const defaultPostReducers = [getPostAuthor, getPostLikes];

const parsePost = ($post, reducers = defaultPostReducers) => {
    // authors can be 'invalid' if they are banned, which throws the structure of their post out of wack or something
    // I don't really care about those cases, so let's not bother handling it
    const isAuthorValid = !!$post.querySelector('.cAuthorPane_author a span');
    if (!isAuthorValid) {
        return null;
    }

    // I feel like I'm doing this incorrectly... this looks very weird
    // Do I need to actually use .reduce here? Should I be?
    const result = reducers.reduce((results, reducer) => {
        return reducer($post, results);
    }, {});

    console.log(`parsePost: parsed post by ${result.author} with ${result.likes} likes`);
    return result;
};

const defaultPageReducers = [filterEmptyPostData, filterLikelessPostData, sumAuthorLikes];

const parsePage = (url, delay) => {
    return new Promise((resolve, reject) => {
        console.log(`parsePage: waiting ${delay / 1000} seconds to make request...`);
        setTimeout(() => {
            console.log(`parsePage: making request...`);
            return request(url)
            .then(body => {
                const { document } = (new JSDOM(body)).window;

                const $posts = [...document.querySelectorAll('.cPost')];
                const postsResults = $posts.map($post => parsePost($post));
                //     .filter(postData => {
                //         // TODO need to extract this filter into a custom param as well
                //         // We can't always count on caring about postData.likes, for example
                //         // This should just be a reducer as well actually, I think...
                //         // Reducer doesn't have to be reduce; it just has to be part of piping one
                //         // thing to another
                //         return !!postData && postData.likes > 0
                //     })
                // const pageResults = postsResults
                //     .reduce((allTotals, { author, likes }) => {
                //         allTotals[author] = allTotals[author] || 0;
                //         allTotals[author] += likes;
                //         return allTotals;
                //     }, {});

                const pageResults = defaultPageReducers.reduce((results, reducer) => {
                    return reducer(results);
                }, postsResults);

                console.log(`parsePage: parsed page with the following results: ${JSON.stringify(pageResults)}`);
                resolve(pageResults);
                return pageResults;
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

    const allPageResults = allPageUrls.map((url, i) => parsePage(url, delay * i));
    
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