const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate')

const NewsController = require('../src/controller/NewsController')

const routes = express.Router()

routes.post("/robotNews", celebrate({
    [Segments.BODY]:
        Joi.object().keys({
            someURL: Joi.string().required().uri(),
            lang: Joi.string().length(2)
        })
}), NewsController.create)

routes.post("/robotNews", NewsController.save)


routes.get("/robotNews", celebrate({
    [Segments.BODY]:
        Joi.object().keys({
            pageCursor: Joi.string(),
        })
}), NewsController.index)

routes.delete("/robotNews", celebrate({
    [Segments.BODY]:
        Joi.object().keys({
            news: Joi.string(),
            font: Joi.string(),
        })
}), NewsController.delete)


module.exports = routes