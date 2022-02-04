import db from '../db.js';

export async function getRecords(req, res) {
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
};

export async function postRecords(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const registryData = req.body;

    if(!token) {
        return res.status(401).send("Erro token")
    };

     try {
        const session = await db.collection('sessions').findOne({ token });

        if (!session) {
            return res.status(402).send("Erro sessão")
        };

        await db.collection('registry').insertOne({ ...registryData, userID: session.userID });
        res.sendStatus(201) 
    } catch {
        res.sendStatus(500)
    }
};