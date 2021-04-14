'use strict';

const repository = require('./reviewRepository');

module.exports = {
    create,
    select,
    selectById
}

async function create(params) {
    try {
        let result = await repository.create(params);
        return {
            result: result,
            message: "review created"
        };
    } catch (error) {
        throw error;
    }
}

async function select(params) {
    try {
        let result = await repository.select();
        return {
            result: result,
            message: "reviews found"
        };
    } catch (error) {
        return error;
    }
}

async function selectById(params) {
    try {
        let result = await repository.selectById(params);
        return {
            result: result,
            message: "review found"
        };
    } catch (error) {
        return error;
    }
}
