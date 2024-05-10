module.exports = asyncFn => {
    return async (req, res, next) => {
        asyncFn(req, res).catch(next);
    }
}