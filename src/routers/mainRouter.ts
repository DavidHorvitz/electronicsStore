import express from 'express';
import { main as initDB } from '../index';
import { ProductRouter } from './productRouter';
import { SellerRouter } from './sellerRouter';
import { ClientRouter } from './clientRouter';
export async function mainRouter() {
    const app = express()
  
    const db = await initDB()
    app.use(express.json({ limit: "10kb" }))
    app.use("/product", ProductRouter(db))
    app.use("/seller", SellerRouter(db))
    app.use("/client", ClientRouter(db))
    // app.use("/lecturer", createLecturerRouter(db))
    
    app.listen(8080, () => {
      console.log(`Example app listening on port 8088`)
    })
  }
  
  mainRouter().then(() => {
    console.log("Exiting")
  })
