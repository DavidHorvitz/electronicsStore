import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { ProductModel } from "../models/productModel";



type ProductSchemaModel = Model<ProductModel>

export interface ProductInterface {
    Schema: ModelStatic<ProductSchemaModel>
    insert: (product: Omit<ProductModel, "SKU">) => Promise<ProductModel>
    searchById: (id: string) => Promise<ProductModel | undefined>
}

export async function createTable(sequelize: Sequelize): Promise<ProductInterface> {
    const ProductSchema = sequelize.define<ProductSchemaModel>('product', {
        SKU: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        ProductName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        PriceToTheCustomer: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        
    },
        {
            schema:"electronicsStore",
            createdAt: false,
        });
    await ProductSchema.sync();
    return {
        Schema: ProductSchema,
        async insert(product) {
            const result = await ProductSchema.create(product as ProductModel)
            return result.toJSON();
        },
        async searchById(id: string) {
            const result = await ProductSchema.findByPk(id)
            return result?.toJSON();
        }

    }

}
export type ProductTable = Awaited<ReturnType<typeof createTable>>;