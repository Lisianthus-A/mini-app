import type { Middleware } from '../index';

const queryParser: Middleware = (req, res, next) => {
  const query = {};

  req.query = query;
  next();
}

export default queryParser;