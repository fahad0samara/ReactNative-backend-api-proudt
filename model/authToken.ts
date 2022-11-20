const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authToken = async (req: {
    user: any; headers: { authorization: string; }; 
}, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; }, next: any) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).send("Access Denied");
        try {
           const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            const user = await User.findOne({
                _id: verified._id
            });
            if (!user) return res.status(401).send("Access Denied");
            req.user = user;
            next();
            
        } catch (error) {
            res.status(400).send("Invalid Token");

            
        }
    } else {
        res.status(401).send("Access Denied");

       
    }
        
    }

module.exports = authToken;

    