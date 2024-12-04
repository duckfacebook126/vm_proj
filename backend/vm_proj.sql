
	SELECT * FROM user_type
	SELECT * FROM DISK
		SELECT * FROM users
		
	
	
	 SELECT * FROM virtual_machine

	 

	`users`-- Create the users table
	CREATE TABLE users (
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    firstName VARCHAR(50) NOT NULL,
	    lastName VARCHAR(50) NOT NULL,
	    phoneNumber BIGINT NOT NULL,
	    CNIC BIGINT UNIQUE NOT NULL,
	    email VARCHAR(100) NOT NULL,
	    userName VARCHAR(50) UNIQUE NOT NULL,
	    PASSWORD VARCHAR(255) NOT NULL
	   ,
	   userType VARCHAR(255) NOT NULL 
	);

	-- Create the operating_system table
	CREATE TABLE operating_system (
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    NAME VARCHAR(255) NOT NULL
	);

	-- Create the disk_flavor table
	CREATE TABLE disk_flavor (
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    NAME VARCHAR(255) NOT NULL,
	    size INT NOT NULL
	);

	-- Create the virtual_machine table with cascading deletes
	CREATE TABLE virtual_machine (
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    NAME VARCHAR(255) NOT NULL,
	    ram INT NOT NULL,
	    CPU INT NOT NULL,
	    cores INT NOT NULL,
	    osId INT,
	    userId INT,
	    flavorId INT,
	    size INT,
	    FOREIGN KEY (osId) REFERENCES operating_system(id) ON DELETE CASCADE,
	    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
	    FOREIGN KEY (flavorId) REFERENCES disk_flavor(id) ON DELETE CASCADE
	);

	-- Create the disk table with cascading deletes
	CREATE TABLE DISK (
	    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	    NAME VARCHAR(255) NOT NULL,
	    size INT NOT NULL,
	    flavorId INT,
	    userId INT,
	    vmId INT,
	    FOREIGN KEY (flavorId) REFERENCES disk_flavor(id) ON DELETE CASCADE,
	    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
	    FOREIGN KEY (vmId) REFERENCES virtual_machine(id) ON DELETE CASCADE
	);

	CREATE TABLE user_type (
	    userId INT NOT NULL PRIMARY KEY,
	    typeId INT NOT NULL,
	    typeName VARCHAR(255) NOT NULL,
	    permission VARCHAR(255) NOT NULL,
	    FOREIGN KEY (userId) REFERENCES users(id)
	    
	    
	);

s

	SET FOREIGN_KEY_CHECKS = 0;

	DROP TABLE virtual_machine;
	DROP TABLE DISK;
	DROP TABLE users;
	DROP TABLE operating_system;
	DROP TABLE disk_flavor

	DROP TABLE permissions;
	DROP TABLE user_type;




