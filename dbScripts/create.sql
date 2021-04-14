--CREATE DATABASE backendtest;

--------------------------------------------------------------------------------------------------------

CREATE TABLE address(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    street VARCHAR(80),
    neighborhood VARCHAR(50),
    number VARCHAR(5),
    complement VARCHAR(80),
    cep VARCHAR(8),
    state VARCHAR(2),
    city VARCHAR(40),
    main BOOLEAN
);

--------------------------------------------------------------------------------------------------------

CREATE TABLE serviceprovider(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(60),
    workingArea VARCHAR(60),
    experienceSkills VARCHAR(80),
    createdAt DATETIME
);

--------------------------------------------------------------------------------------------------------

CREATE TABLE addressServiceProvider(
    addressId INT,
    serviceproviderId INT,
    CONSTRAINT fk_addressServiceProvider_address FOREIGN KEY(addressId) REFERENCES address(id),
    CONSTRAINT fk_addressServiceProvider_serviceProvider FOREIGN KEY(serviceproviderId) REFERENCES serviceprovider(id)
);

--------------------------------------------------------------------------------------------------------

CREATE TABLE phone(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ddd VARCHAR(2),
    number VARCHAR(9),
    main BOOLEAN
);

--------------------------------------------------------------------------------------------------------

CREATE TABLE phoneServiceProvider(
    phoneId INT,
    serviceproviderId INT,
    CONSTRAINT fk_phoneServiceProvider_phone FOREIGN KEY(phoneId) REFERENCES phone(id),
    CONSTRAINT fk_phoneServiceProvider_serviceProvider FOREIGN KEY(serviceProviderId) REFERENCES serviceProvider(id)
);

--------------------------------------------------------------------------------------------------------

CREATE TABLE email(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(60),
    main BOOLEAN
);

--------------------------------------------------------------------------------------------------------

CREATE TABLE emailServiceProvider(
    emailId INT,
    serviceproviderId INT,
    CONSTRAINT fk_emailServiceProvider_email FOREIGN KEY(emailId) REFERENCES email(id),
    CONSTRAINT fk_emailServiceProvider_serviceProvider FOREIGN KEY(serviceproviderId) REFERENCES serviceProvider(id)
);

--------------------------------------------------------------------------------------------------------

CREATE TABLE review(
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
);

--------------------------------------------------------------------------------------------------------