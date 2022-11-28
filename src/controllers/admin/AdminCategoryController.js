const Category = require('../../models/Category')
const Game = require('../../models/Game')
const responses = require('../../utils/responses')
const fileHandler = require('../../utils/fileHandler')

exports.index = async (req, res) => {
    let site = req.query.site
    let where = {}
    if (site) {
        where.region = site
    }
    await Category.findAll({ attributes: ['uId', 'name', 'image', 'enabled', 'id'], order: [['createdAt', 'DESC']], where: where })
        .then(v => responses.dataSuccess(res, v)).catch(err => responses.serverError(res, err))
}

exports.show = async (req, res) => {
    await Category.findOne({
        where: { uId: req.params.id },
        attributes: ['uId', 'name', 'image', 'enabled', 'id']
    })
        .then(v => v ? responses.dataSuccess(res, v) : responses.notFoundError(res, `The Category With Identification ${req.params.id} Cannot Be Found`))
        .catch(err => responses.serverError(res, err))
}

exports.store = async (req, res) => {
    const category = Category.build(req.body)
    category.image = await fileHandler.addImage(req.body.image)
    await category.save().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
}

exports.update = async (req, res) => {
    const body = req.body
    const category = body.Cat
    category.name = body.name
    category.uId = body.uId
    category.image = await fileHandler.addImage(body.image)
    category.enabled = body.enabled
    let cat = new Category()
    cat = category
    await category.save().then(v => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
}

exports.destroy = async (req, res) => {
    let cat = new Category()
    cat = req.body.Cat
    try {
        await cat.destroy().then(() => responses.blankSuccess(res))
    }
    catch (err) {
        responses.serverError(res, "Please Delete The Enabled Games And Games Before Deleting This Category")
    }
}

