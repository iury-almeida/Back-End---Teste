'use strict';

const service = require('./reviewService');

module.exports = {
    create,
    select,
    selectById
}

async function create(req, res) {
    try {
        let result = await service.create(req.body);
        res.status(201);
        res.send(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

async function select(req, res) {
    try {
        let result = await service.select();
        res.status(200);
        res.send(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

async function selectById(req, res) {
    try {
        let result = await service.selectById(req.params);
        res.status(200);
        res.send(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

