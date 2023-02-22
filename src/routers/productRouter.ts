import express, { Request, Response } from "express"
import { DB } from "../index";


export function ProductRouter(db: DB) {
    const productRouter = express.Router();
    productRouter.post('/', async (req: Request, res: Response) => {
        const product = await db.Seller.insert(req.body);
        res.json(product);
    })
    
   return productRouter;
}