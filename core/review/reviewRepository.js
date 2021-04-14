'use strict';

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

let db = new sqlite3.Database('./database.sqlite', async (error) => {
    if (error) {
        console.log(error);
        return;
    }

    db = await sqlite.open({ filename: './database.sqlite', driver: sqlite3.Database });
})

module.exports = {
    create,
    select,
    selectById
}

async function create(params) {

    try {

        let result = await db.all(`
            INSERT INTO review(
                raterName,
                raterEmail,
                raterDDD,
                raterPhone,
                rateWritten,
                rate,
                serviceProviderId, 
                createdAt
            )
            VALUES(
                '${params.raterName}',
                '${params.raterEmail}',
                '${+params.raterDdd}',
                '${+params.raterPhone}',
                '${params.rateWritten}',
                '${+params.rate}',
                '${params.serviceProviderId}',
                '${new Date().toISOString()}'
            );
        `);

        result = await db.all(`SELECT last_insert_rowid() as id;`);

        return result[0];
    } catch (error) {
        throw error;
    }
}

async function select() {
    try {
        let result = await db.all(
            `
            SELECT 
                r.raterName as "raterName",
                r.raterEmail as "raterEmail",
                r.raterDDD as "raterDdd",
                r.raterPhone as "raterPhone",
                r.rateWritten as "rateWritten",
                r.rate,
                r.serviceproviderId as "serviceProviderId",
                r.createdAt as "createdAt",
                sp.name as "serviceProviderName"
            FROM review r
            INNER JOIN serviceProvider sp
                ON r.serviceProviderId = sp.id 
            ORDER BY r.id asc
        `
        );

        return result;
    } catch (error) {
        throw error;
    }
}

async function selectById(params) {
    try 
    {

        let result = await db.all( `
        SELECT sp.name, sp.id FROM serviceProvider sp
            WHERE sp.id =  ${+params.id}
            ORDER BY sp.id ASC
        `);

        result[0].review = [];
        
        let reviewResult = await db.all(`
        SELECT 
            r.id,
            r.raterName as "raterName",
            r.raterEmail as "raterEmail",
            r.raterDDD as "raterDdd",
            r.raterPhone as "raterPhone",
            r.rateWritten as "rateWritten",
            r.rate,
            r.serviceproviderId as "serviceProviderId",
            r.createdAt as "createdAt"
         FROM review r
            INNER JOIN serviceProvider sp
                ON sp.id = ${+params.id}
            ORDER BY r.id ASC
        `);

        reviewResult.map(x => {
            result[0].review.push(x);
        });

        return result;
    } catch (error) {
        throw error;
    }
}
