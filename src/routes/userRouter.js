import { Router } from 'express';
import { getRecords, postRecords } from '../controllers/userControllers.js';
import validateMovement from '../middlewares/validateMovement.js';

const userRouter = Router();

userRouter.get('/records', getRecords);
userRouter.post('/records', validateMovement, postRecords);

export default userRouter;