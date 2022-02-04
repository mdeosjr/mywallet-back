import joi from 'joi';

const movementSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.string().required().valid('debt', 'entry'),
    date: joi.string().required()
})

export default async function validateMovement(req, res, next) {
    const validation = movementSchema.validate(req.body);
        if(validation.error) {
            return res.status(422).send("Erro de validação")
        }
    
    next();
} 