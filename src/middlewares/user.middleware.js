import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

export function getUserFromToken(req) {
    try {
        if (!req.cookies || !req.cookies[cookieName]) {                        
            const user = null;
            return user ;           
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

