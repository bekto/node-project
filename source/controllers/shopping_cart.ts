import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import ShoppingCart from '../models/shopping_cart';

const NAMESPACE = "Shopping Cart"

const createList = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Creating new Shopping Cart list");

    let { list_name,  list_items} = req.body;

    if (!list_items) {
        list_items = []
    }

    const _shopping_cart = new ShoppingCart({
        name: list_name,
        user_id: res.locals.jwt.user_id,
        items: list_items
    });

    try {
        const cart = await _shopping_cart.save();
        return res.status(201).json({
            cart
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const updateListName = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Updating existing Shopping Cart list name");

    let { list_name,  new_list_name} = req.body;

    if (list_name && new_list_name) {
        let query = { name: list_name, user_id: res.locals.jwt.user_id }
    
        ShoppingCart.findOneAndUpdate(query, { name: new_list_name }, { new: true }, (error, data) => {
            if (error) {
                return res.status(500).json({
                    message: error.message
                })
            } else if (data) {
                return res.status(200).json({
                    message: 'Shopping Cart name successfully changed!',
                    cart: data
                })
            } else {
                return res.status(404).json({
                    message: 'Shopping Cart with given name not found!'
                })
            }
        })
    }else {
        return res.status(500).json({
            message: 'Please provide list_name and new_list_name to change the name of the list!'
        })
    }
};

const updateListItems = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Updating existing Shopping Cart list items");

    let { list_name,  list_items } = req.body;

    if (!list_items) {
        list_items = []
    }

    if (list_name) {
        let query = { name: list_name, user_id: res.locals.jwt.user_id }
    
        ShoppingCart.findOneAndUpdate(query, { items: list_items }, { new: true }, (error, data) => {
            if (error) {
                return res.status(500).json({
                    message: error.message
                })
            } else if (data) {
                return res.status(200).json({
                    message: 'Shopping Cart items successfully changed!',
                    cart: data
                })
            } else {
                return res.status(404).json({
                    message: 'Shopping Cart with given name not found!'
                })
            }
        })
    }else {
        return res.status(500).json({
            message: 'Please provide list_name and list_items to change the items in the Shopping Cart!'
        })
    }
};


const removeList = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Removing Shopping Cart");

    let list_name  = req.body.list_name;

    if (list_name) {
        let query = { name: list_name, user_id: res.locals.jwt.user_id }
    
        ShoppingCart.findOneAndRemove(query, null, (error, removedData) => {
            if (error) {
                return res.status(500).json({
                    message: error.message
                })
            } else if (removedData) {
                return res.status(200).json({
                    message: 'Shopping Cart successfully removed!',
                    cart: removedData
                })
            } else {
                return res.status(404).json({
                    message: 'Shopping Cart with given name not found!'
                })
            }
        })
    }else {
        return res.status(500).json({
            message: 'Please provide list_name to remove Shopping Cart!'
        })
    }
};

const getListByName = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Getting the Shopping Cart by the name");

    let list_name  = req.body.list_name;

    if (list_name) {
        let query = { name: list_name, user_id: res.locals.jwt.user_id }
    
        ShoppingCart.findOne(query, null, null, (error, data) => {
            if (error) {
                return res.status(500).json({
                    message: error.message
                })
            } else if (data) {
                return res.status(200).json({
                    cart: data
                })
            } else {
                return res.status(404).json({
                    message: 'Shopping Cart with given name not found!'
                })
            }
        })
    }else {
        return res.status(500).json({
            message: 'Please provide list_name to get Shopping Cart!'
        })
    }
};



export default { createList, updateListName, updateListItems, removeList, getListByName };