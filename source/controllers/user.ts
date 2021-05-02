import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/user';
import signJWT from '../functions/signJWT';

const NAMESPACE = "User"

const register = (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body; 

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(500).json({
                message: hashError.message
            })
        }

        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            password: hash
        });

        return _user.save()
        .then(user =>{
            return res.status(201).json({
                user
            })
        })
        .catch(error => {
            return res.status(500).json({
                message: error.message
            })
        })
    })
};

const login = (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;

    if (email) {
        User.findOne({ email })
        .exec()
        .then(user => {
            if (user) {
                bcryptjs.compare(password, user.password, (error, result) => {
                    if (error){
                        logging.error(NAMESPACE, error.message, error);
    
                        return res.status(401).json({
                            message: 'Unauthorized'
                        });
                    } else if (result) {
                        signJWT(user, (_error, token) => {
                            if (_error) {
                                return res.status(401).json({
                                    message: 'Unauthorized',
                                    error: _error
                                });
                            }
                            else if (token) {
                                return res.status(200).json({
                                    message: 'Auth Successful',
                                    token
                                })
                            }
                        });
                    } else {
                        return res.status(401).json({
                            message: 'Wrong password!'
                        });
                    }
                });
            } else {
                logging.error(NAMESPACE, 'User not found!');
    
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }   
        })
        .catch(error => {
            return res.status(500).json({
                message: error.message,
                error
            })
        })
    } else {
        return res.status(500).json({
            message: 'Missing Email'
        })
    }
};

const updatePassword = (req: Request, res: Response, next: NextFunction) => {
    let { old_pass, new_pass } = req.body; 

    User.findOne({ _id: res.locals.jwt.user_id })
        .exec()
        .then(user => {
            if (user) {
                bcryptjs.compare(old_pass, user.password, (error, result) => {
                    if (error){
                        logging.error(NAMESPACE, error.message, error);
    
                        return res.status(401).json({
                            message: error.message
                        });
                    } else if (result) {
                        bcryptjs.hash(new_pass, 10, (hashError, hash) => {
                            if (hashError) {
                                return res.status(500).json({
                                    message: hashError.message
                                })
                            }
                            User.findOneAndUpdate({ _id: user._id}, { password: hash }, null,  (error, data) => {
                                if (error) {
                                    return res.status(500).json({
                                        message: error.message
                                    })
                                } else if (data) {
                                    return res.status(200).json({
                                        message: 'Password successfully changed!'
                                    })
                                } else {
                                    return res.status(404).json({
                                        message: 'User not found!'
                                    })
                                }
                            })
                        })
                    } else {
                        return res.status(401).json({
                            message: 'Old password is wrong!'
                        });
                    }
                });
            } else {    
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }   
        })
        .catch(error => {
            logging.error(NAMESPACE, 'User not found!');
            return res.status(500).json({
                message: error.message,
                error
            })
        })
};

export default { register, login, updatePassword };