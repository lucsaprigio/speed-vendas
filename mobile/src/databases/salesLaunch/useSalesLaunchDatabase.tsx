import { useSQLiteContext } from "expo-sqlite";

export type SaleLaunchDatabase = {
    id: number;
    sale_id: number;
    product_id: number;
    product_description: string;
    price: number
    descount: number;
    quantity: number;
    total_price: number;
}

export function useSaleLaunchDatabase() {
    const database = useSQLiteContext();

    async function create(data: Omit<SaleLaunchDatabase, "id">) {
        const statement = await database.prepareAsync(
            'INSERT INTO saleLaunch (sale_id, product_id, product_description, price, descount, quantity, total_price) VALUES ($sale_id, $product_id, $product_description, $price, $descount, $quantity, $total_price); '
        );

        try {
            await statement.executeAsync({
                $sale_id: data.sale_id,
                $product_id: data.product_id,
                $product_description: data.product_description,
                $price: data.price,
                $descount: data.descount,
                $quantity: data.quantity,
                $total_price: data.total_price
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    };

    async function update(data: SaleLaunchDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE saleLaunch SET sale_id = $saleid product_id = $productid product_description = $product_description, price = $price, descount = $descount, quantity = $quantity, total_price = $total_price`
        );

        try {
            await statement.executeAsync({
                $sale_id: data.sale_id,
                $product_id: data.product_id,
                $product_description: data.product_description,
                $price: data.price,
                $descount: data.descount,
                $quantity: data.quantity,
                $total_price: data.total_price
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function listAll() {
        try {
            const query = 'SELECT * FROM saleLaunch';

            const response = await database.getAllAsync<SaleLaunchDatabase>(query);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function findById(sale_id: string, product_id: number) {
        try {
            const query = 'SELECT * FROM saleLaunch WHERE sale_id = ? AND product_id = ?';

            const response = await database.getAllAsync<SaleLaunchDatabase>(query, sale_id, product_id);

            return response;
        } catch (error) {
            throw error
        }
    }

    async function deleteIten(sale_id: string, product_id: number) {
        const statement = await database.prepareAsync(
            'DELETE FROM saleLaunch WHERE sale_id = $sale_id AND product_id = $product_id'
        );
        try {
            await statement.executeAsync({
                $sale_id: sale_id,
                $product_id: product_id
            });

        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function deleteAll() {
        const statement = await database.prepareAsync(
            'DELETE FROM saleLaunch;'
        );

        try {
            await statement.executeAsync();

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { create, listAll, update, findById, deleteAll, deleteIten };
}