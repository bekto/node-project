import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import IUser from '../interfaces/user';

const NAMESPACE = 'Auth';

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void) => {
    logging.info(NAMESPACE, `Attempting to sign token for ${user.username}`)

    try {
        jwt.sign({
            user_id: user.id
        },
        config.server.token.secret,
        {
            issuer: config.server.token.issuer,
            algorithm: 'HS256',
            expiresIn: config.server.token.expireTime,
        },
        (error, token) => {
            if (error) {
                callback(error, null);
            } else if (token) {
                callback(null, token);
            }
        }
        );
    } catch (error) {
        logging.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
}

export default signJWT;