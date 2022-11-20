import express from 'express'
const router = express.Router();
import { listCategory, listProducts } from "./Data";



router.get("/product", (req: any, res: any) => {
    return res.json(listProducts
        .map(item => ({
            id: item.id,
            name: item.name,
            img: item.img,
            type: item.type,
            pricePerKg: item.pricePerKg,



        }))
        .filter(item => {
            if (req.query.type) {
                return item.type === parseInt(req.query.type);
            }
            return item;




        })
        .filter(item =>
            req.query.search ? item.name.toLowerCase().includes(req.query.search.toLowerCase()) : item



        ));



});


/* Returning the list of categories. */
router.get("/category", (req: any, res: any) => {
    return res.json(listCategory);
});












export default router;