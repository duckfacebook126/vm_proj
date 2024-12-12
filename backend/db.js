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
/**
 * @summary The Database class is a singleton class that provides connection pooling to the MySQL database.
 * @description This class is designed to be used with the async/await syntax to get a connection from the pool.
 * The getConnection method can be used to get a connection from the pool. If the connection is not returned to the pool,
 * a new connection will be created.
 * @workflow
 * 1. The Database class is created.
 * 2. The pool is created with the provided options.
 * 3. The getConnection method is called to get a connection from the pool.
 * 4. If the connection is not returned to the pool, a new connection will be created.
 * 5. The connection is returned to the pool.
 * 6. The process is repeated.
 * @example
 * const db = require('./db');
 *
 * async function getVMs() {
 *   const connection = await db.getConnection();
 *   const [rows] = await connection.execute('SELECT * FROM vms');
 *   connection.release();
 *   return rows;
 * }
 */
