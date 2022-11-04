const { NotFound } = require("http-errors");
const Joi = require("joi");
const contactsOperations = require("../../models/contactsFunctions");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const updateById = async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      error.status = 400;
      error.message = "missing fields";
      throw error;
    }
    const { contactId } = req.params;
    const result = await contactsOperations.updateById(contactId, req.body);
    if (!result) {
      throw NotFound(`Contact with id = ${contactId} not found`);
    }

    res.json({
      status: "success",
      code: 200,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateById;
