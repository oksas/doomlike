const pipe = (fns) => {
    return function(initialValue) {
        return fns.reduce((value, f) => f(value), initialValue);
    }
}

module.exports = pipe;