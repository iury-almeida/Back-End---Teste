
'use strict';

try {
    (async () => {
        const sqlite3 = require('sqlite3');
        const sqlite = require('sqlite');

        let db = new sqlite3.Database('./database.sqlite', async (error) => {
            if (error) {
                console.log(error);
                return;
            }
        });

        db = await sqlite.open({ filename: './database.sqlite', driver: sqlite3.Database });

        await db.run(`CREATE TABLE IF NOT EXISTS address(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            street VARCHAR(80),
            neighborhood VARCHAR(50),
            number VARCHAR(5),
            complement VARCHAR(80),
            cep VARCHAR(8),
            state VARCHAR(2),
            city VARCHAR(40),
            main BOOLEAN
        );`);

        await db.run(`
        CREATE TABLE IF NOT EXISTS serviceprovider(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workingArea VARCHAR(60),
            experienceSkills VARCHAR(80),
            name VARCHAR(60)

        );`);


        await db.run(`CREATE TABLE IF NOT EXISTS addressServiceProvider(
            addressId INT,
            serviceproviderId INT,
            CONSTRAINT fk_addressServiceProvider_address FOREIGN KEY(addressId) REFERENCES address(id),
            CONSTRAINT fk_addressServiceProvider_serviceProvider FOREIGN KEY(serviceproviderId) REFERENCES serviceprovider(id)
        );`);

        await db.run(`CREATE TABLE IF NOT EXISTS phone(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ddd VARCHAR(2),
            number VARCHAR(9),
            main BOOLEAN
        );`);

        await db.run(`
        CREATE TABLE IF NOT EXISTS phoneServiceProvider(
            phoneId INT,
            serviceproviderId INT,
            CONSTRAINT fk_phoneServiceProvider_phone FOREIGN KEY(phoneId) REFERENCES phone(id),
            CONSTRAINT fk_phoneServiceProvider_serviceProvider FOREIGN KEY(serviceProviderId) REFERENCES serviceProvider(id)
        );`);

        await db.run(`CREATE TABLE IF NOT EXISTS email(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email VARCHAR(60),
            main BOOLEAN
        );`);

        await db.run(`CREATE TABLE IF NOT EXISTS emailServiceProvider(
            emailId INT,
            serviceproviderId INT,
            CONSTRAINT fk_emailServiceProvider_email FOREIGN KEY(emailId) REFERENCES email(id),
            CONSTRAINT fk_emailServiceProvider_serviceProvider FOREIGN KEY(serviceproviderId) REFERENCES serviceProvider(id)
        );`);
        
        await db.run(`CREATE TABLE IF NOT EXISTS review(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            raterName VARCHAR(60),
            raterEmail VARCHAR(60),
            raterDDD VARCHAR(2),
            raterPhone VARCHAR(9),
            rateWritten TEXT,
            rate INT,
            serviceProviderId INT,
            createdAt DATETIME,
            CONSTRAINT fk_serviceProvider_review FOREIGN KEY(serviceProviderId) REFERENCES serviceprovider(id)
        );`);

    })()

} catch (error) {
    console.error(error);
}

     
