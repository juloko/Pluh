const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate')

const PluhController = require('../src/controller/PluhController')

const routes = express.Router()

routes.post("/pluh", celebrate({
    [Segments.BODY]:
        Joi.object().keys({
            chatId: Joi.string().invalid(...['Delete','Data']).required(),
            userId: Joi.string().required(),
            msg: Joi.string().required()
        })
}), PluhController.create)

routes.post("/session", celebrate({
    [Segments.BODY]:
        Joi.object().keys({
            chatId: Joi.string().invalid(...['Delete','Data']).required(),
            userId: Joi.string().required(),
        })
}), PluhController.session)

routes.get("/pluh", celebrate({
    [Segments.QUERY]:
        Joi.object().keys({
            pageCursor: Joi.string().allow(''),
            chatId: Joi.string().invalid(...['Delete','Data']).required(),
            nMsgs: Joi.string().required(),
        })
}), PluhController.index)

routes.delete("/pluh", celebrate({
    [Segments.QUERY]:
        Joi.object().keys({
            chatId: Joi.string().required(),
        })
}), PluhController.delete)


routes.patch("/pluh", celebrate({
    [Segments.QUERY]:
        Joi.object().keys({
            chatId: Joi.string().required(),
            nUsers: Joi.number().required(),
            secret: Joi.boolean().required(),
        })
}), PluhController.patch)


module.exports = routes