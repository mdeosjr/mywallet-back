import { Router } from 'express';
import { signUp, signIn } from '../controllers/authControllers.js';
import validateLogin from '../middlewares/validateLogin.js';
import validateRegister from '../middlewares/validateRegister.js';

const authRouter = Router();

authRouter.post('/sign-up', validateRegister, signUp);
authRouter.post('/sign-in', validateLogin, signIn);

export default authRouter;