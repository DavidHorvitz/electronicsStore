import express, { Request, Response } from "express"
import { DB } from "../index";
import { isUUID } from "../validation/validateUUID";


export function ClientRouter(db: DB) {
    const clientRouter = express.Router();
    clientRouter.post('/', async (req: Request, res: Response) => {
        const client = await db.Seller.insert(req.body);
        res.json(client);
    })
    clientRouter.post('/:clientId/product/:productId', async (req: Request, res: Response) => {
        const { clientId, SKU } = req.params;

        if (!isUUID(clientId)) {
            return res.status(400).json({ error: 'Invalid clientId parameter' });
        }
        if (!isUUID(SKU)) {
            return res.status(400).json({ error: 'Invalid SKU parameter' });
        }
        const client = await db.Sale.addProductToClient(SKU, clientId);
        if (!client) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'student adding to course is success !' });
        }
        console.log(client);

    });

   return clientRouter;
}