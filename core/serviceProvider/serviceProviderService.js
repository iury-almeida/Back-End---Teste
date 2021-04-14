'use strict';

const repository = require('./serviceProviderRepository');

module.exports = {
    create,
    update,
    select,
    selectById,
    remove
}

async function create(params) {
    try {
        let result = await repository.create(params);
        return {
            result: result,
            message: "serviceProvider created"
        };
    } catch (error) {
        throw error;
    }
}

async function update(params) {
    try {
        let result = await repository.update(params);
        return {
            result: result,
            message: "serviceProvider updated"
        };;
    } catch (error) {
        throw error;
    }
}

async function select(params) {
    try {
        let result = await repository.select();
        return {
            result: result,
            message: "serviceProviders found"
        };
    } catch (error) {
        throw error;
    }
}

async function selectById(params) {
    try {
        let result = await repository.selectById(params);
        return {
            result: result,
            message: "serviceProvider found"
        };
    } catch (error) {
        throw error;
    }
}

async function remove(params) {
    try {
        let result = await repository.remove(params);
        return {
            result: result,
            message: "serviceProvider removed"
        };
    } catch (error) {
        throw error;
    }
}
