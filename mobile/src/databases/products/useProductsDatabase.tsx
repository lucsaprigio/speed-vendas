import { useSQLiteContext } from "expo-sqlite";

export type ProductsDatabase = {
    id: number;
    ean: string;
    description: string;
    price: number;
}

export function useProductsDatabase() {
    const database = useSQLiteContext();

    async function create(data: ProductsDatabase) {
        const statement = await database.prepareAsync(
            `INSERT INTO products (id, ean, description, price) values ($id, $ean, $description, $price);`
        );

        try {
            const result = await statement.executeAsync({
                $id: data.id,
                $ean: data.ean,
                $description: data.description,
                $price: data.price
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
            const query = 'SELECT * FROM products';

            const response = database.getAllAsync<ProductsDatabase>(query);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function findById(id: number) {
        try {
            const query = 'SELECT * FROM products WHERE id = ?';

            const result = await database.getAllAsync<ProductsDatabase>(query, id);

            return result;
        } catch (error) {
            throw error;
        }
    }

    async function update(data: ProductsDatabase) {
        const statement = await database.prepareAsync(
            `UPDATE products SET id = $id, ean = $ean, description = $description, price = $price`
        );
        try {
            await statement.executeAsync({
                $id: data.id,
                $ean: data.ean,
                $description: data.description,
                $price: data.price
            });

        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function deleteAll() {
        const statement = await database.prepareAsync(
            `DELETE FROM products;`
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