const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/User");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONT_URL, // Replace with your frontend's URL
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


app.use(session({
    secret: "Never Mind",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

const port = process.env.PORT || 3001;

app.listen(prot, () => {
    console.log(`Server is running on port ${port}`);
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, username: user.username };
                // console.log(email);
                console.log(user.username);
                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match");
            }
        } 
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({ username, password: hashedPassword });
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// app.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await UserModel.findOne({ email });
//         if (user) {
//             const passwordMatch = await bcrypt.compare(password, user.password);
//             if (passwordMatch) {
//                 req.session.user = { id: user._id, name: user.name, email: user.email };
//                 // console.log(email);
//                 console.log(user.name);
//                 res.json("Success");
//             } else {
//                 res.status(401).json("Password doesn't match");
//             }
//         } else {
//             res.status(404).json("No Records found");
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});

app.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json("Not authenticated");
    }
});
