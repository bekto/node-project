import express from 'express';
import controller from '../controllers/shopping_cart';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/', extractJWT, controller.getListByName);
router.post('/', extractJWT, controller.createList);
router.delete('/', extractJWT, controller.removeList);
router.put('/name', extractJWT, controller.updateListName);
router.put('/items', extractJWT, controller.updateListItems);

export = router;
