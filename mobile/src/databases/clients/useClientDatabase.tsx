import { useSQLiteContext } from "expo-sqlite";

export type ClientDatabase = {
    id: number;
    client_name: string;
    cpf_cnpj: string;
    address: string
    phone: string;
}

export function useClientDatabase() {
    const database = useSQLiteContext();

    async function create(data: ClientDatabase) {
        const statement = await database.prepareAsync(
            `INSERT INTO clients (id, client_name, cpf_cnpj, address, phone) values ($id, $client_name, $cpf_cnpj, $address, $phone);`
        );

        try {
            const result = await statement.executeAsync({
                $id: data.id,
                $client_name: data.client_name,
                $cpf_cnpj: data.cpf_cnpj,
                $address: data.address,
                $phone: data.phone
            });

            return result;
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function list() {
        try {
            const query = 'SELECT * FROM clients';

            const response = database.getAllAsync<ClientDatabase>(query);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function findById(id: number) {
        try {
            const query = 'SELECT * FROM clients WHERE id = ?';

            const result = await database.getAllAsync<ClientDatabase>(query, id);

            return result;
        } catch (error) {
            throw error;
        }
    }

    async function update(data: ClientDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE clients SET client_name = $client_name cpf_cnpj = $cpf_cnpj, address = $address, phone = $phone`
        );
        try {
            await statement.executeAsync({
                $id: data.id,
                $client_name: data.client_name,
                $cpf_cnpj: data.cpf_cnpj,
                $address: data.address,
                $phone: data.phone
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function deleteAll() {
        const statement = await database.prepareAsync(
            `DELETE FROM cliFents;`
        );
        try {
            await statement.executeAsync();

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { create, list, update, deleteAll, findById };
}