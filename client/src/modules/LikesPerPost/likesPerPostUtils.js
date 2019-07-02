export function reduceLikesPerPost(aggregateResults) {
    const allAuthors = Object.keys(aggregateResults);
    return allAuthors.map(author => {
        return {
            author,
            likesPerPost: aggregateResults[author].totalLikes / aggregateResults[author].posts.length
        }
    })
}