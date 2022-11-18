const Joi = require('joi')
// register validation
const registerValidation = (data: any) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(5).required()
    });
    return schema.validate(data);
}




// login validation
const loginValidation = (data: any) => {
    const schema = Joi.object({
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(5).required()
    });
    return schema.validate(data);



}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;



