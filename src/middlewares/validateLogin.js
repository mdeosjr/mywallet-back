import joi from 'joi';

const loginSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});

export default async function validateLogin(req, res, next) {
     const validation = loginSchema.validate(req.body);
        if (validation.error) {
            return res.status(422).send("Preencha todos os campos!");
        }
    
    next();
}
