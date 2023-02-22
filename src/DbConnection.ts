import { createTable as createClientTable } from './schema/client';
import { createTable as createProductTable } from './schema/product';
import { createTable as createSellerTable } from './schema/seller ';
import { createTable as createSaleTable } from './schema/sale';
import { createTable as createProductSellerTable } from './schema/productSeller'
import { Sequelize } from 'sequelize';

export function getConnection() {
    const sequelize = new Sequelize({
        database: 'electronicsStore',
        username: "postgres",
        host: "localhost",
        dialect: "postgres",
        port: 5432,
        password: "!Q@W3e4r",
        logging: (sql) => {
            console.log("Query: %s", sql)
        }
    });
    return sequelize;
}

export async function createTables() {
    const connection = getConnection()
    const Client = await createClientTable(connection);
    const Product = await createProductTable(connection);
    const Sale = await createSaleTable(connection, Client.Schema, Product.Schema);
    const Seller = await createSellerTable(connection, Product.Schema, Sale.Schema);
    const ProductSeller = await createProductSellerTable(connection, Seller.Schema, Product.Schema, Sale.Schema);
    return {
        Client,
        Product,
        Seller,
        Sale,
        ProductSeller
    }
}
