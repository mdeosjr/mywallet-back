import joi from 'joi';

const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
});

export default async function validateRegister(req, res, next) {
    const validation = registerSchema.validate(req.body);
        if (validation.error) {
            return res.status(422).send("Preencha todos os campos corretamente!");
        }
    
    next();
} 