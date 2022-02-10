import type { Middleware } from '../index';

const paramsParser: Middleware = (req, res, next) => {
  const params: Record<string, string> = {};

  req.params = params;
  next();
}

export default paramsParser;