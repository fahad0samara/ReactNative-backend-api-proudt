"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const authToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (!token)
            return res.status(401).send("Access Denied");
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            const user = yield User.findOne({
                _id: verified._id
            });
            if (!user)
                return res.status(401).send("Access Denied");
            req.user = user;
            next();
        }
        catch (error) {
            res.status(400).send("Invalid Token");
        }
    }
    else {
        res.status(401).send("Access Denied");
    }
});
module.exports = authToken;
