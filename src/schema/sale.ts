
import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { saleModel } from '../models/saleModel';
import { ClientInterface } from './client';
import { ProductInterface } from './product';


type SaleModelSchemaModel = Model<saleModel>

export interface SaleInterface {
    Schema: ModelStatic<SaleModelSchemaModel>
    addProductToClient: (SKU: string, clientId: string) => Promise<void | undefined>
}
export async function createTable(sequelize: Sequelize, Client: ClientInterface["Schema"], Product: ProductInterface["Schema"]):
    Promise<SaleInterface> {
    const SaleSchema = sequelize.define<SaleModelSchemaModel>('sale', {
        PriceToTheCustomer: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    } as any, {
        schema: "electronicsStore",
        createdAt: false

    });
    Client.belongsToMany(Product, { through: SaleSchema });
    Product.belongsToMany(Client, { through: SaleSchema });
    await SaleSchema.sync();
    return {
        Schema: SaleSchema,
        async addProductToClient(SKU: string, clientId: string) {
            const Product = sequelize.models.product;
            const Client = sequelize.models.client;

            const product = await Product.findByPk(SKU);
            if (!product) {
                throw new Error(`Product with ID ${SKU} not found`);
            }

            const client = await Client.findByPk(clientId);
            if (!client) {
                throw new Error(`Client with ID ${clientId} not found`);
            }

            await (client as any).addProduct(product);
        },
    }
}
export type SaleTable = Awaited<ReturnType<typeof createTable>>;