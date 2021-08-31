const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const materialService = require('./material.service');

// routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/suppliers', authorize(Role.Admin), getSuppliers);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
    materialService.getAll()
        .then(materials => res.json(materials))
        .catch(next);
}

function getSuppliers(req, res, next) {
    materialService.getSuppliers()
        .then(suppliers => res.json(suppliers))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own account and admins can get any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    materialService.getById(req.params.id)
        .then(material => material ? res.json(material) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        materialName: Joi.string().required(),
        description: Joi.string().required(),
        stock: Joi.number().integer().min(0).max(9999),
        supplierId: Joi.number().integer().min(0).max(9999)
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    materialService.create(req.body)
        .then(material => res.json(material))
        .catch(next);
}

function updateSchema(req, res, next) {
    //const schemaRules = {
    const schemaRules = Joi.object({
        materialName: Joi.string().empty(''),
        description: Joi.string().empty(''),
        stock: Joi.number().integer().min(0).max(9999),
        supplierId: Joi.number().integer().min(0).max(9999)
    });
    validateRequest(req, next, schemaRules);
}

function update(req, res, next) {
    // users can update their own account and admins can update any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    materialService.update(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    materialService.delete(req.params.id)
        .then(() => res.json({ message: 'Material eliminado con éxito.' }))
        .catch(next);
}