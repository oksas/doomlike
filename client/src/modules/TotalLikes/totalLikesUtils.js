export function reduceTotalLikes(aggregateResults) {
    const allAuthors = Object.keys(aggregateResults);
    return allAuthors.map(author => {
        return {
            author,
            totalLikes: aggregateResults[author].totalLikes
        }
    })
}