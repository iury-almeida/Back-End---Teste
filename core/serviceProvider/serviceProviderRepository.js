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
    update,
    select,
    selectById,
    remove
}

async function create(params) {

    try {

        let result = await db.all(`
            INSERT INTO serviceProvider(
                name,
                workingArea,
                experienceSkills
            )
            VALUES(
                '${params.name}',
                '${params.workingArea}',
                '${params.experienceSkills}'
            );
        `);

        result = await db.all(`SELECT last_insert_rowid() as id;`);

        //referencing and adding service provider's addresses
        let addressResult;

        for (let i = 0; i < params.address.length; i++) {

            addressResult = await db.all(`
                INSERT INTO address(
                    street, 
                    neighborhood,
                    "number",
                    complement,
                    cep,
                    state,
                    city,
                    main
                )
                VALUES(
                    '${params.address[i].street}',
                    '${params.address[i].neighborhood}',
                    ${+params.address[i].number},
                    '${params.address[i].complement || ''}',
                    ${+params.address[i].cep},
                    '${params.address[i].city}',
                    '${params.address[i].state}',
                    ${params.address[i].main || false}
                )
            `);

            addressResult = await db.all(`SELECT last_insert_rowid() as id;`);

            await db.all(`
                INSERT INTO addressServiceProvider(
                    addressId,
                    serviceProviderId
                )
                VALUES(
                    ${+addressResult[0].id},
                    ${+result[0].id}
                )
            `)
            //verify how ur recieving the params for referencing

        };

        //referencing and adding service provider's email

        let emailResult;

        for (let i = 0; i < params.email.length; i++) {

            emailResult = await db.all(`
                INSERT INTO email(
                    email,
                    main
                )
                VALUES(
                    '${params.email[i].email}',
                    ${params.email[i].main || false}
                )
                
            `);

            emailResult = await db.all(`SELECT last_insert_rowid() as id;`);

            await db.all(`
                INSERT INTO emailServiceProvider(
                    emailId,
                    serviceProviderId
                )
                VALUES(
                    ${+emailResult[0].id},
                    ${+result[0].id}
                )
            `)

        };

        //referencing and adding service provider's phone

        let phoneResult;

        for (let i = 0; i < params.phone.length; i++) {

            phoneResult = await db.all(`
                INSERT INTO phone(
                    ddd,
                    "number",
                    main
                )
                VALUES(
                    ${+params.phone[i].ddd},
                    ${+params.phone[i].number},
                    ${params.phone[i].main || false}
                )
                
            `);

            phoneResult = await db.all(`SELECT last_insert_rowid() as id;`);

            await db.all(`
                INSERT INTO phoneServiceProvider(
                    phoneId,
                    serviceProviderId
                )
                VALUES(
                    ${+phoneResult[0].id},
                    ${+result[0].id}
                )
            `)


        };

        return result[0];
    } catch (error) {
        throw error;
    }
}

async function update(params) {
    try {

        await db.all(`
            UPDATE serviceProvider
            SET
                name = '${params.name}',
                workingArea = '${params.workingArea}',
                experienceSkills = '${params.experienceSkills}'
            WHERE id = ${+params.id};    
        `);

        //referencing and adding service provider's addresses which is not in db 
        let addressResult;

        for (let i = 0; i < params.address.length; i++) {

            if (!params.address[i].id) {

                addressResult = await db.all(`
                    INSERT INTO address(
                        street, 
                        neighborhood,
                        number,
                        complement,
                        cep,
                        city,
                        main
                    )
                    VALUES(
                        '${params.address[i].street}',
                        '${params.address[i].neighborhood}',
                        ${params.address[i].number},
                        '${params.address[i].complement || ''}',
                        ${params.address[i].cep},
                        '${params.address[i].city}',
                        ${params.address[i].main || false}
                    );
                `);

                addressResult = await db.all(`SELECT last_insert_rowid() as id;`);

                params.address[i].id = addressResult[0].id;

                await db.all(`
                    INSERT INTO addressServiceProvider(
                        serviceproviderId,
                        addressId
                    )
                    VALUES(
                        ${params.id},
                        ${+addressResult[0].id}
                    )
                `)
            }
            else {
                await db.all(`
                    UPDATE address
                    SET 
                        street,  = '${params.address[i].street}',
                        neighborhood, = '${params.address[i].neighborhood}',
                        "number", = ${+params.address[i].number},
                        complement, = '${params.address[i].complement || ''}',
                        cep, = ${+params.address[i].cep},
                        state, = '${params.address[i].city}',
                        city, = '${params.address[i].state}',
                        main = ${params.address[i].main || false}
                    WHERE id = ${params.address[i].id}
                `)
            }

        };

        //removing service provider's addresses reference
        let addressIds = [];

        params.address.map(x => {
            addressIds.push(x.id);
        });

        await db.all(`
            DELETE FROM addressServiceProvider 
            WHERE serviceProviderId = ${params.id} AND addressId NOT IN (${addressIds});
        `);

        //referencing and adding service provider's email which is not in db

        let emailResult;

        for (let i = 0; i < params.email.length; i++) {

            if (!params.email[i].id) {

                emailResult = await db.all(`
                    INSERT INTO email(
                        email,
                        main
                    )
                    VALUES(
                        '${params.email[i].email}',
                        ${params.email[i].main || false}
                    );
                    
                `);

                emailResult = await db.all(`SELECT last_insert_rowid() as id;`);

                params.email[i].id = emailResult[0].id;

                await db.all(`
                    INSERT INTO emailServiceProvider(
                        serviceProviderId,
                        emailId
                    )
                    VALUES(
                        ${+params.id},
                        ${+emailResult[0].id} 
                    )
                `);
            }
            else {
                await db.all(`
                    UPDATE email
                    SET 
                        email = '${params.email[i].email}',
                        main = '${params.email[i].main}'
                    WHERE id  = ${params.email[i].id}
                `);
            }
        };

        //removing service provider's emails reference
        let emailIds = [];

        params.email.map(x => {
            emailIds.push(x.id);
        });

        await db.all(`
             DELETE FROM emailServiceProvider 
             WHERE serviceProviderId = ${params.id} AND emailId NOT IN (${emailIds});
         `);

        //referencing and adding service provider's phone which is not in db

        let phoneResult;

        for (let i = 0; i < params.phone.length; i++) {

            if (!params.phone[i].id) {

                phoneResult = await db.all(`
                    INSERT INTO phone(
                        ddd,
                        "number",
                        main
                    )
                    VALUES(
                        ${+params.phone[i].ddd},
                        ${+params.phone[i].number},
                        ${params.phone[i].main || false}
                    );
                    
                `);

                phoneResult = await db.all(`SELECT last_insert_rowid() as id;`);

                params.phone[i].id = phoneResult[0].id;

                await db.all(`
                    INSERT INTO phoneServiceProvider(
                        serviceProviderId,
                        phoneId
                    )
                    VALUES(
                        ${+params.id},
                        ${+phoneResult[0].id}
                    )
                `);
            }

            else {
                await db.all(`
                    UPDATE phone
                    SET 
                        ddd = ${params.phone[i].ddd},
                        "number" = ${params.phone[i].number},
                        main = ${params.phone[i].main}
                    WHERE id  = ${params.phone[i].id}
                `);
            }
        }

        //removing service provider's phones reference
        let phoneIds = [];

        params.phone.map(x => {
            phoneIds.push(x.id);
        });

        await db.all(`
            DELETE FROM phoneServiceProvider 
            WHERE serviceProviderId = ${params.id} AND phoneId NOT IN (${phoneIds});
        `);

        return params.id;

    } catch (error) {
        throw error;
    }
}

async function select(params) {
    try {
        let result = await db.all(
            `
            SELECT 
                sp.id,
                sp.name,
                sp.workingArea as "workingArea",
                sp.experienceSkills as "experienceSkills"
            FROM serviceProvider sp
            ORDER BY id asc
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
        SELECT 
            sp.id,
            sp.name,
            sp.workingArea as "workingArea",
            sp.experienceSkills as "experienceSkills"
        FROM serviceProvider sp
            WHERE sp.id = ${params.id}
            ORDER BY sp.id ASC
        `);

        result[0].address = [];
        result[0].email = [];
        result[0].phone = [];

        let addressResult = await db.all(`
        SELECT 
            DISTINCT(a.id),
            a.id,
            a.street ,
            a.neighborhood,
            a.number,
            a.complement,
            a.cep,
            a.state,
            a.city,
            a.main
        FROM ADDRESS a
            INNER JOIN addressServiceProvider asp
                ON (asp.serviceProviderId = ${+params.id})
            WHERE a.id = asp.addressId
            
            ORDER BY a.id ASC
        `);
        
        //stil need to check these two queries above
        let emailResult = await db.all(`
        SELECT 
            e.id, 
            e.email,
            e.main
        FROM email e
            INNER JOIN emailServiceProvider esp
                ON (esp.serviceProviderId = ${+params.id})
            WHERE e.id = esp.emailId
        `);

        let phoneResult = await db.all(`
        SELECT 
            p.id, 
            p.ddd,
            p.number,
            p.main
        FROM phone p
            INNER JOIN phoneServiceProvider psp
                ON (psp.serviceProviderId = ${+params.id})
            WHERE p.id = psp.phoneId
        `);

        addressResult.map(x => {
            result[0].address.push(x);
        });

        emailResult.map(x => {
            result[0].email.push(x);
        });

        phoneResult.map(x => {
            result[0].phone.push(x);
        });

        return result;
    } catch (error) {
        throw error;
    }
}


async function remove(params) {
    try 
    {

        await db.all( `
            DELETE FROM addressServiceProvider WHERE serviceProviderid = ${params.id};
        `);

        await db.all( `
            DELETE FROM emailServiceProvider WHERE serviceProviderid = ${params.id};
        `);

        await db.all( `
            DELETE FROM phoneServiceProvider WHERE serviceProviderid = ${params.id};
        `);

        await db.all( `
            DELETE FROM serviceProvider WHERE id = ${params.id};
        `);
       
        return;
    } catch (error) {
        throw error;
    }
}
