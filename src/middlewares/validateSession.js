import db from '../db.js';

export default async function validateSession(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).send("Erro token")
    };

    const session = await db.collection('sessions').findOne({ token });
    console.log(session)

    if (!session) {
        return res.status(401).send("Erro sessão")
    };
    
    res.locals.session = session;
    next();
}