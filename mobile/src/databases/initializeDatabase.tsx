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
        `);
    } catch (error) {
        throw error
    }
}