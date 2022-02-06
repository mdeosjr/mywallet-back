import { Router } from 'express';
import { getRecords, postRecords } from '../controllers/userControllers.js';
import validateMovement from '../middlewares/validateMovement.js';
import validateSession from '../middlewares/validateSession.js';

const userRouter = Router();

userRouter.use(validateSession);
userRouter.get('/records', getRecords);
userRouter.post('/records', validateMovement, postRecords);

export default userRouter;