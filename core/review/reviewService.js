'use strict';

const repository = require('./reviewRepository');

module.exports = {
    create,
    update,
    select,
    selectById,
    // remove
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

async function update(params) {
    try {
        let result = await repository.update(params);
        return {
            result: result,
            message: "review updated"
        };
    } catch (error) {
        return error;
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

// async function remove(params) {
//     try {
//         let result = await repository.remove(params);
//         return result;
//     } catch (error) {
//         return error;
//     }
// }
