import { Model, ModelStatic, Sequelize } from 'sequelize';
import { ProductSellerModel } from "../models/productSellerModel";
import { SellerInterface } from './seller ';
import { ProductInterface } from './product';
import { SaleInterface } from './sale';



type ProductSellerSchemaModel = Model<ProductSellerModel>
export interface ProductSellerInterface {
    Schema: ModelStatic<ProductSellerSchemaModel>
    addProductToSeller: (SKU: string, sellerId: string) => Promise<void | undefined>
    getSellerWithHimProduct: (sellerId: string) => Promise<string>
    getSellerWithHimSells: (sellerId: string) => Promise<string>
}

export async function createTable(sequelize: Sequelize,
    Seller: SellerInterface["Schema"],
    Product: ProductInterface["Schema"],
    Sale: SaleInterface["Schema"]):
    Promise<ProductSellerInterface> {
    const ProductSellerSchema = sequelize.define<ProductSellerSchemaModel>('productSeller', {
    } as ProductSellerModel,
        {
            schema: "electronicsStore",
            createdAt: false,
        });
    Product.belongsTo(Seller, { foreignKey: 'Product_id' });
    Seller.hasMany(Product, { foreignKey: 'Product_id' });
    await ProductSellerSchema.sync();
    
    return {
        Schema: ProductSellerSchema,
        async addProductToSeller(SKU: string, sellerId: string) {
            const Product = sequelize.models.product;
            const Seller = sequelize.models.seller;

            const product = await Product.findByPk(SKU);
            if (!product) {
                throw new Error(`Course with ID ${SKU} not found`);
            }

            const seller = await Seller.findByPk(sellerId);
            if (!seller) {
                throw new Error(`Student with ID ${sellerId} not found`);
            }

            await (seller as any).addProduct(product);
        },
        async getSellerWithHimProduct(sellerId) {
            const result = await Seller.findOne({
                where: {
                    Id: sellerId,
                },
                include: [
                    {
                        model: Product,
                        through: {
                            attributes: [],
                        }
                    }
                ]
            });
            if (!result) {
                throw new Error('Course not found');
            }
            const data: any = result.toJSON();
            return data;
        },
        async getSellerWithHimSells(sellerId) {
            const result = await Seller.findOne({
                where: {
                    Id: sellerId,
                },
                include: [
                    {
                        model: Sale,
                        attributes: ["PriceToTheCustomer"]
                    },
                ]
            });
            if (!result) {
                throw new Error('Course not found');
            }
            const data: any = result.toJSON();
            return data;
        }


    }

}
export type ProductSellerTable = Awaited<ReturnType<typeof createTable>>;