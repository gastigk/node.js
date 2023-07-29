import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const secret = config.jwt.key;
const cookieName = config.jwt.cookiename;

export function getUserFromToken(req) {
  try {
    if (!req.cookies || !req.cookies[cookieName]) {
      const user = null;
      return user;
    }

    const userToken = req.cookies[cookieName];
    const decodedToken = jwt.verify(userToken, secret);
    return decodedToken;
  } catch (error) {
    console.error('Failed to verify token:', error);
    return null;
  }
}

export function getUserId(req) {
  try {
    const user = getUserFromToken(req);
    if (!user || !user.userId) {
      throw new Error('Could not get token user id');
    }
    return user.userId;
  } catch (error) {
    console.error('Failed to get user id:', error);
    return null;
  }
}
