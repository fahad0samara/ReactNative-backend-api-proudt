"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Data_1 = require("./Data");
router.get("/product", (req, res) => {
    return res.json(Data_1.listProducts
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
        .filter(item => req.query.search ? item.name.toLowerCase().includes(req.query.search.toLowerCase()) : item));
});
/* Returning the list of categories. */
router.get("/category", (req, res) => {
    return res.json(Data_1.listCategory);
});
exports.default = router;
