const getPostAuthor = ($post, results) => {
    return {
        ...results,
        author: $post.querySelector('.cAuthorPane_author a span').innerHTML
    };
};

const getPostLikes = ($post, results) => {
    return {
        ...results,
        likes: parseInt($post.querySelector('[data-role="reactCountText"]').innerHTML || 0, 10)
    };
};

// How do I name all of these functions so that their usage is clear?
// IE how do I make it clear what belongs to part of the same "category" of reducers?
// Some take postsData, some take pageData, etc. It needs to be clear what is what
// Maybe something that would help to consider: these should be ignorant of pages vs posts,
// perhaps. They should only care about the structure of the data passed in, not the context
// in which that data lives (page vs post)
const filterEmptyPostData = (postsResults) => {
    return postsResults.filter(postData => !!postData);
};
const filterLikelessPostData = (postsResults) => {
    return postsResults.filter(postData => postData.likes > 0);
};

// Something to consider: the reducers for post data and page data is pretty closely linked
// If pagedata fetches likes, then pageData should be expected to handle them
// So how can the two sets of reducers become more closely linked in a way that makes sense?
// Can they be combined in any way? I don't think combined, but they should be able to be
// grouped logically somehow...
const sumAuthorLikes = (postsResults) => {
    return postsResults.reduce((totalResults, { author, likes }) => {
        // The way that author data is created if it doesn't already exist
        // is something that might not belong in a specific function like this
        // Can we make global assumptions about the necessity of this behavior?
        // If so, where do we put these default creation logic checks?
        // I don't think we can safely make assumptions that we always want to deal with
        // author objects, for example. If we're scraping images, for example, then that isn't
        // important. But then again... neither is summing page data, in that case...
        totalResults[author] = totalResults[author] || {};
        totalResults[author].likes = totalResults[author].likes || 0;
        totalResults[author].likes += likes;
        return totalResults;
    }, {});
};

module.exports = {
    getPostAuthor,
    getPostLikes,
    filterEmptyPostData,
    filterLikelessPostData,
    sumAuthorLikes
};