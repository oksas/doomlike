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

module.exports = {
    getPostAuthor,
    getPostLikes
};