import db from '../db.js';

export async function getRecords(req, res) {
    const session = res.locals.session;

    try {
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
    const session = res.locals.session;
    const registryData = req.body;

    try {
        await db.collection('registry').insertOne({ ...registryData, userID: session.userID });
        res.sendStatus(201) 
    } catch {
        res.sendStatus(500)
    }
};