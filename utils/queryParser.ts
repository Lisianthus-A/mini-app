import type { Middleware } from '../application';

const queryParser: Middleware = (req, res, next) => {
  const queryArray: string[] = (req.url || '').match(/[?&]([^?&]+)=([^?&]+)/g) || [];
  const query = queryArray.reduce((acc: Record<string, string>, cur) => {
    const [key, value] = cur.slice(1).split('=');
    acc[key] = value;
    return acc;
  }, {});

  req.query = query;
  next();
}

export default queryParser;