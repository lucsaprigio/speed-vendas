import { useSQLiteContext } from "expo-sqlite";

export type SalesDatabase = {
    id?: number;
    client_id: number;
    total: number;
    total_descount: number
    obs: string;
    sent: 'S' | 'N';
}

export function useSalesDatabase() {
    const database = useSQLiteContext();

    async function create(data: Omit<SalesDatabase, "id">) {
        const statement = await database.prepareAsync(
            'INSERT INTO sales (client_id, total, total_descount,obs, sent) VALUES ($client_id, $total, $total_descount, $obs, $sent);'
        );

        try {
            const result = await statement.executeAsync({
                $client_id: data.client_id,
                $total: data.total,
                $total_descount: data.total_descount,
                $obs: data.obs,
                $sent: 'N'
            });

            const lastInsertedRowId = result.lastInsertRowId.toLocaleString();

            return { lastInsertedRowId };
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    };

    async function update(data: SalesDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE sales SET client_id = $client_id, total = $total, total_descount = $total_descount ,obs = $obs, sent = $sent`
        );

        try {
            await statement.executeAsync({
                $client_id: data.client_id,
                $total: data.total,
                $total_descount: data.total_descount,
                $obs: data.obs,
                $sent: data.sent
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function listAll() {
        try {
            const query = 'SELECT * FROM sales';

            const response = await database.getAllAsync<SalesDatabase>(query);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function findById(id: string) {
        try {
            const query = 'SELECT * FROM sales WHERE id = ?';

            const response = await database.getAllAsync<SalesDatabase>(query, id);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function deleteAll() {
        const statement = await database.prepareAsync(
            'DELETE FROM sales;'
        );

        try {
            await statement.executeAsync();

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { create, listAll, update, findById, deleteAll };
}