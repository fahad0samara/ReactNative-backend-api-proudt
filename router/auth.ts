import express from "express";
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authToken = require("../model/authToken");
const cloudinary = require("../config/Cloudinary")
const multer = require('multer')
const { registerValidation, loginValidation } = require("../model/Vailadition");

const router = express.Router();

// register the user and save to the database
router.post("/register", async (req: any, res: any) => {
  // validate the data before we a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if the user is already in the database
  const emailExist = await User.findOne({
    email: req.body.email,
  });
  if (emailExist) return res.status(400).send("Email already exists");

  // hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({
      savedUser,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// login
router.post("/login", async (req: any, res: any) => {
  // validate the data before we a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if the email exists
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send("Email is not found");

  // check if the password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  // create and assign a token
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  }
  );

  let OldToke = user.tokens || []
  if (OldToke.length) {
    OldToke = OldToke.filter(
      (token: { signedAt: string; }) => {
        const timeDiff = Date.now() - parseInt(token.signedAt) / 1000
        if (
          timeDiff < 3600
        ) {
          return token
        }


      }

    )

  }
  await User.findByIdAndUpdate(user._id, {
    tokens: [...OldToke, {
      token,
      signedAt: Date.now().toString()

    }]
  })






  res.header("auth-token", token);
  res.json({
    succuss: true,
    token,
    user,
  });
});

// logout
router.get("/logout", authToken, async (req: any, res: any) => {
  if (req.headers && req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) return res.status(401).send("Access Denied");
      const tokens = req.user.tokens.filter((t: { token: any; }) => t.token !== token);
      await User.findByIdAndUpdate(req.user._id, {
        tokens
      })
      res.send({
        succuss: true,
        message: "logout successfully",
      });

    } catch (error) {
      console.log('====================================');
      console.log(
        "🚀 ~ file: auth.ts ~ line 135 ~ router.get ~ error",
        error
      );
      console.log('====================================');
      res.status(400).json({
        succuss: false,
        message: "Invalid Token",
      });



    }

  }



});

router.get("/profile", authToken, async (req: any, res: any) => {
  if (!req.user)  { 
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
});








const upload = multer({
  dest: "uploads/",
});


router.post(
  "/upload",
  authToken,
  upload.single("image"),



  async (req: any, res: any) => {
    const { user } = req;
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "unauthorized access!" });

    try {
      // update the image for user
      const result = await cloudinary.uploader.upload(
        req.file.path,

        {
          upload_preset: "ml_default",
        }
      );
      const post = await User.findByIdAndUpdate(
        user._id,
        {
          image: {
            url: result.secure_url,
            public_id: result.public_id,
          },
        },
        { new: true }
      );

      res.json({
        success: true,
        post,
        message: "image uploaded successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "image upload failed",
        error,
      });
    }
  }
);










module.exports = router;

export default router;
