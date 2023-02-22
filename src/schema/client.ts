import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { ClientModel } from "../models/clientModel";



type clientSchemaModel = Model<ClientModel>
export interface ClientInterface {
    Schema: ModelStatic<clientSchemaModel>
    insert: (client: Omit<ClientModel, "Id">) => Promise<ClientModel>
    searchById: (id: string) => Promise<ClientModel | undefined>
}

export async function createTable(sequelize: Sequelize): Promise<ClientInterface> {
    const ClientSchema = sequelize.define<clientSchemaModel>('client', {
        Id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        FirstName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        LastName: {
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
            schema:"electronicsStore",
            createdAt: false,
        });

    await ClientSchema.sync();
    return {
        Schema: ClientSchema,
        async insert(client) {
            const result = await ClientSchema.create(client as ClientModel)
            return result.toJSON();
        },
        async searchById(id: string) {
            const result = await ClientSchema.findByPk(id)
            return result?.toJSON();
        }

    }

}
export type ClientTable = Awaited<ReturnType<typeof createTable>>;