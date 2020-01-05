class Validator {
    async validate(req, res, next) {
        if (!req.user) {
            res.send(401, `Missing claims data`);
            return next(false);
        }
        if (!req.user.userId) {
            res.send(401, `Missing parameter: User id from claims`);
            return next(false);
        }

        return next();
    }
}

export default new Validator();
