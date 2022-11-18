"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const auth_1 = __importDefault(require("./router/auth"));
const cetegary_1 = __importDefault(require("./product/cetegary"));
app.set('port', process.env.PORT || 2020);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/auth', auth_1.default);
app.use('/api', cetegary_1.default);
app.listen(app.get('port'), () => {
    console.info(`Server listen on port ${app.get('port')}`);
});
