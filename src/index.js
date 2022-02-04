import express, { json } from 'express';
import cors from 'cors';
import router from './routes/routes.js';

const server = express();
server.use(cors());
server.use(json());
server.use(router);

server.listen(5000);

//mongod --dbpath ~/.mongo