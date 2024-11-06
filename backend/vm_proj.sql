CREATE TABLE users (
  user_id INT  NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  cnic INT UNIQUE NOT NULL,
  phone_no INT NOT NULL UNIQUE,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) NOT NULL,
  PASSWORD VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE disks (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    vm_name VARCHAR(255) NOT NULL,
    size INT,
    virtual_machine_id INT
);


CREATE TABLE disk_flavor (
    id INT UNIQUE,
    NAME VARCHAR(255),
    size INT
);



CREATE TABLE operating_system(

id INT UNIQUE,
NAME VARCHAR(255) NOT NULL

);


CREATE TABLE virtual_machine(
id INT PRIMARY KEY AUTO_INCREMENT,
vm_name VARCHAR(255),
user_id INT,
os_id INT,
disk_flavor_id INT,`taks_api``taks_api``taks_api`
vm_status VARCHAR(255),

FOREIGN KEY(user_id)REFERENCES users(user_id),
FOREIGN KEY(os_id)REFERENCES operating_system(id),
FOREIGN KEY(disk_flavor_id)REFERENCES disk_flavor(id)

);

ALTER TABLE disks
ADD COLUMN flavor_id INT,
ADD CONSTRAINT fk_disk_flavors
FOREIGN KEY (flavor_id) REFERENCES disk_flavor(id);