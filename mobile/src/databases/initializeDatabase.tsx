import { type SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(database: SQLiteDatabase) {
    try {
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY,
                client_name TEXT NOT NULL,
                cpf_cnpj TEXT NOT NULL,
                address TEXT,
                phone TEXT
            );
            CREATE TABLE IF NOT EXISTS session (
                id INTEGER NOT NULL,
                device TEXT,
                user_id INTEGER NOT NULL,
                username TEXT,
                sessionEnd TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
            CREATE TABLE IF NOT EXISTS devices (
                id INTEGER NOT NULL,
                device,
                cnpj,
                ip_api TEXT
            );
            CREATE TABLE IF NOT EXISTS products(
                id INTEGER PRIMARY KEY,
                ean TEXT,
                description TEXT,
                price REAL,
                sent TEXT
            );
            CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER, 
                total REAL,
                total_descount REAL, 
                obs TEXT,
                sent TEXT,
                FOREIGN KEY (client_id) REFERENCES clients (id)
            );
            CREATE TABLE IF NOT EXISTS saleLaunch(
                id INTEGER PRIMARY KEY,
                sale_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                product_description TEXT,
                price REAL,
                descount REAL,
                quantity INTEGER,
                total_price INTEGER,
                FOREIGN KEY (sale_id) REFERENCES sales (id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            );
        `);
    } catch (error) {
        throw error
    }
}