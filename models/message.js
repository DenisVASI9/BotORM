const Joi = require("joi");

const MessageSchema = Joi.object({
    phone: Joi.string().min(7).max(20).required(),
    name: Joi.string().min(1).max(100).required(),
    company: Joi.string().min(1).max(100).required(),
    sphere: Joi.string().min(1).max(100).required(),
    city: Joi.string().min(1).max(100).required(),
    email: Joi.string().min(1).max(100).required()
})

const CommercialMessageSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    phone: Joi.string().min(7).max(20).required(),
    email: Joi.string().min(1).max(100).required()
})

module.exports = {
    MessageSchema,
    CommercialMessageSchema
}
