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

const movementSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().required().valid('debt', 'entry'),
    date: joi.string().required()
})

server.post('/sign-up', async (req, res) => {
    const user = req.body;
    const passwordHash = bcrypt.hashSync(user.password, 10);

    try {
        const validation = registerSchema.validate(user);
        if (validation.error) {
            return res.status(422).send("Preencha todos os campos corretamente!");
        }

        const unavailableEmail = await db.collection('users').findOne({ email: user.email});

        if (unavailableEmail) { 
            return res.status(409).send("Usuário já cadastrado!")
        }

        await db.collection('users').insertOne({...user, password: passwordHash});
        res.sendStatus(201)
    } catch {
        res.sendStatus(500)
    }
});

server.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;
    let token;

    try {
        const validation = loginSchema.validate(req.body);
        if (validation.error) {
            return res.status(422).send("Preencha todos os campos!");
        }

        const user = await db.collection('users').findOne({ email: email });

        if(!user) {
            return res.status(401).send("Usuário não encontrado!")
        };
       
        if (user && bcrypt.compareSync(password, user.password)) {
            token = uuid();
            await db.collection('sessions').insertOne({ token, userID: user._id })
        };

        res.status(201).send({ token, name: user.name });
    } catch {
        res.sendStatus(500)
    }
});

server.get('/records', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).send("Erro token")
    };

    try {
        const session = await db.collection('sessions').findOne({ token });

        if (!session) {
            return res.status(401).send("Erro sessão")
        };

        const user = await db.collection('registry').find({ userID: session.userID }).toArray();

        if (!user) {
            return res.status(401).send("Erro usuário")
        };

        res.status(201).send(user)  
    } catch {
        res.sendStatus(500)
    }
});

server.post('/records', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const registryData = req.body;

    if(!token) {
        return res.status(401).send("Erro token")
    };

     try {
        const validation = movementSchema.validate(registryData);

        if(validation.error) {
            return res.status(422).send("Erro de validação")
        }

        const session = await db.collection('sessions').findOne({ token });

        if (!session) {
            return res.status(402).send("Erro sessão")
        };

        await db.collection('registry').insertOne({ ...registryData, userID: session.userID });
        res.sendStatus(201) 
    } catch {
        res.sendStatus(500)
    }
})

server.listen(5000);

//mongod --dbpath ~/.mongo