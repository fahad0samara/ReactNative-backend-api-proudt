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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authToken = require("../model/authToken");
const { registerValidation, loginValidation } = require("../model/Vailadition");
const router = express_1.default.Router();
// register the user and save to the database
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validate the data before we a user
    const { error } = registerValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    // check if the user is already in the database
    const emailExist = yield User.findOne({
        email: req.body.email,
    });
    if (emailExist)
        return res.status(400).send("Email already exists");
    // hash passwords
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(req.body.password, salt);
    // create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUser = yield user.save();
        res.send({
            savedUser,
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
}));
// login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validate the data before we a user
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    // check if the email exists
    const user = yield User.findOne({
        email: req.body.email,
    });
    if (!user)
        return res.status(400).send("Email is not found");
    // check if the password is correct
    const validPass = yield bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.status(400).send("Invalid password");
    // create and assign a token
    const token = jwt.sign({
        _id: user._id,
    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
    });
    let OldToke = user.tokens || [];
    if (OldToke.length) {
        OldToke = OldToke.filter((token) => {
            const timeDiff = Date.now() - parseInt(token.signedAt) / 1000;
            if (timeDiff < 3600) {
                return token;
            }
        });
    }
    yield User.findByIdAndUpdate(user._id, {
        tokens: [...OldToke, {
                token,
                signedAt: Date.now().toString()
            }]
    });
    res.header("auth-token", token);
    res.json({
        succuss: true,
        token,
        user,
    });
}));
// logout
router.get("/logout", authToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers && req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token)
                return res.status(401).send("Access Denied");
            const tokens = req.user.tokens.filter((t) => t.token !== token);
            yield User.findByIdAndUpdate(req.user._id, {
                tokens
            });
            res.send({
                succuss: true,
                message: "logout successfully",
            });
        }
        catch (error) {
            console.log('====================================');
            console.log("🚀 ~ file: auth.ts ~ line 135 ~ router.get ~ error", error);
            console.log('====================================');
            res.status(400).json({
                succuss: false,
                message: "Invalid Token",
            });
        }
    }
}));
router.get("/profile", authToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.json({
            success: false,
            message: "User not found",
        });
    }
    res.json({
        success: true,
        message: "User found",
        user: req.user,
    });
}));
module.exports = router;
exports.default = router;
