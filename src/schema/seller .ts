import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { SellerModel } from "../models/sellerModel";
import { ProductInterface } from './product';
import { SaleInterface } from './sale';



type SellerSchemaModel = Model<SellerModel>
export interface SellerInterface {
    Schema: ModelStatic<SellerSchemaModel>
    insert: (supplier: Omit<SellerModel, "Id">) => Promise<SellerModel>
    searchById: (id: string) => Promise<SellerModel | undefined>
    deleteSellerById: (id: string) => Promise<boolean>

}

export async function createTable(sequelize: Sequelize, Product: ProductInterface["Schema"], Sale: SaleInterface["Schema"]): Promise<SellerInterface> {
    const SellerSchema = sequelize.define<SellerSchemaModel>('seller', {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        CompanyNumber: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Phone: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Email: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
        {
            schema: "electronicsStore",
            createdAt: false,
        });

    await SellerSchema.sync();
    return {
        Schema: SellerSchema,
        async insert(supplier) {
            const result = await SellerSchema.create(supplier as SellerModel)
            return result.toJSON();
        },
        async searchById(id: string) {
            const result = await SellerSchema.findByPk(id)
            return result?.toJSON();
        },
    
        async deleteSellerById(id: string) {
            const result = await SellerSchema.destroy({
                where: { Id: id }
            });
            return result === 1;
        }

    }

}
export type SellerTable = Awaited<ReturnType<typeof createTable>>;