const mongoose = require("mongoose");
const Joi = require("joi");

const User = mongoose.model('User', {
    userId: String,
    chatId: String
});

const UserSchema = Joi.object({
    userId: Joi.string().required(),
    chatId: Joi.string().required()
})

module.exports = {
    User,
    UserSchema
}
