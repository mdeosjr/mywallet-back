import express, { json } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const server = express();
server.use(cors());
server.use(json());

const mongoClient = new MongoClient(process.env.MYWALLET_URI);
let db;
mongoClient.connect(() => {
    db = mongoClient.db("MyWallet")
});

const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
});

const loginSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});

server.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body;
    const validation = registerSchema(req.body);

    if (validation.error) {
        return res.sendStatus(422);
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        const unavailableEmail = await db.collection('users').findOne({ email: email});

        if (unavailableEmail) { 
            return res.sendStatus(400)
        }

        await db.collection('users').insertOne({...req.body, password: passwordHash});
        res.sendStatus(201)
    } catch {
        res.sendStatus(500)
    }
});

server.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;
    const validation = loginSchema(req.body);
    const token;
    
    if (validation.error) {
        return res.sendStatus(422);
    }

    try {
        const user = await db.collection('users').findOne({ email: email });

        if(!user) {
            return res.sendStatus(401)
        };
       
        if (user && bcrypt.compareSync(password, user.password)) {
            token = uuid();
            await db.collection('sessions').insertOne({ token, userID: user._id })
        };

        res.status(201).send(token);
    } catch {
        res.sendStatus(500)
    }
})

server.listen(5000);