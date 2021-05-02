import express from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';
import validator from '../middleware/validator';

const router = express.Router();

router.post('/register', validator.userValidationRules(), validator.validate, controller.register);
router.post('/login', controller.login);
router.put('/password', extractJWT, validator.passwordUpdateValidationRules(), validator.validate, controller.updatePassword)

export = router;
