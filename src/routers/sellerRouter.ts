import express, { Request, Response } from "express"
import { DB } from "../index";
import { isUUID } from "../validation/validateUUID";


export function SellerRouter(db: DB) {
    const sellerRouter = express.Router();
    sellerRouter.post('/', async (req: Request, res: Response) => {
        const seller = await db.Seller.insert(req.body);
        res.json(seller);
    });
    sellerRouter.post('/:sellerId/product/:productId', async (req: Request, res: Response) => {
        const { sellerId, productId } = req.params;

        if (!isUUID(sellerId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }
        if (!isUUID(productId)) {
            return res.status(400).json({ error: 'Invalid studentId parameter' });
        }
        const seller = await db.ProductSeller.addProductToSeller(productId, sellerId);
        if (!seller) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'student adding to course is success !' });
        }
        console.log(seller);

    });
    sellerRouter.get('/:sellerId/product/', async (req: Request, res: Response) => {
        const { sellerId } = req.params;

        if (!isUUID(sellerId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const seller = await db.ProductSeller.getSellerWithHimProduct(sellerId);
        if (!seller) {
            res.status(404).json({ seller: 'not found' });
        }
        else {
            res.status(200).json({ status: 'get course with his students succeeded !' });
        }
        console.log(seller);

    });
    sellerRouter.get('/:sellerId/sale/', async (req: Request, res: Response) => {
        const { sellerId } = req.params;

        if (!isUUID(sellerId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const seller = await db.ProductSeller.getSellerWithHimSells(sellerId);
        if (!seller) {
            res.status(404).json({ seller: 'not found' });
        }
        else {
            res.status(200).json({ status: 'get course with his students succeeded !' });
        }
        console.log(seller);

    });
    sellerRouter.delete('/:sellerId', async (req: Request, res: Response) => {
        const sellerId = req.params.sellerId;

        // check if courseId is a valid UUID
        if (!isUUID(sellerId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const seller = await db.Seller.deleteSellerById(sellerId);
        if (seller) {
            return res.status(200).json({ status: 'deleted' });
        } else {
            return res.status(404).json({ status: 'not found' });
        }
    });
    return sellerRouter;
}