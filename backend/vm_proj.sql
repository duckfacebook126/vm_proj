-- Create the users table
CREATE TABLE users (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    phoneNumber BIGINT NOT NULL,
    CNIC BIGINT UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    userName VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the operating_system table
CREATE TABLE operating_system (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Create the disk_flavor table
CREATE TABLE disk_flavor (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    size INT NOT NULL
);

-- Create the virtual_machine table with cascading deletes
CREATE TABLE virtual_machine (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    ram INT NOT NULL,
    cpu INT NOT NULL,
    cores INT NOT NULL,
    osId INT,
    userId BIGINT,
    flavorId INT,
    size INT,
    FOREIGN KEY (osId) REFERENCES operating_system(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flavorId) REFERENCES disk_flavor(id) ON DELETE CASCADE
);

-- Create the disk table with cascading deletes
CREATE TABLE disk (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    flavorId INT,
    userId BIGINT,
    vmId INT,
    FOREIGN KEY (flavorId) REFERENCES disk_flavor(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vmId) REFERENCES virtual_machine(id) ON DELETE CASCADE
);
