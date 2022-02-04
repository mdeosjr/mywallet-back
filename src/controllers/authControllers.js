import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db from '../db.js';

export async function signUp(req, res) {
    const user = req.body;
    const passwordHash = bcrypt.hashSync(user.password, 10);

    try {
        const unavailableEmail = await db.collection('users').findOne({ email: user.email});

        if (unavailableEmail) { 
            return res.status(409).send("Usuário já cadastrado!")
        }

        await db.collection('users').insertOne({...user, password: passwordHash});
        res.sendStatus(201)
    } catch {
        res.sendStatus(500)
    }
};

export async function signIn(req, res) {
    const { email, password } = req.body;
    let token;

    try {
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
};