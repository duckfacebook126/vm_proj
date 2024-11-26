const mysql = require('mysql2/promise');

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = mysql.createPool({
                host: 'localhost',  
                port: 3307, // Ensure host, user, password, and database are correct
                user: 'root',
                password: '',         // Your MySQL password here
                database: 'vm_proj'
            });
            Database.instance = this;
        }
        return Database.instance;
    }

    async getConnection() {
        try {
            return await this.pool.getConnection();
        } catch (err) {
            console.log('Error getting connection:', err);
            throw err;
        }
    }
}

module.exports = new Database();
