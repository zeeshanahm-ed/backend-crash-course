const express = require("express");
const env = require('dotenv');
const path = require("path");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const connectMongoose = require("./connection");
const authRouter = require("./src/routes/auth.routes");
const userRouter = require("./src/routes/user.routes");
const authenticationToken = require("./src/middleware/authentication");
const multer = require('multer')
env.config();

const app = express();
app.use(cors());
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/views'));

connectMongoose().then(() => console.log("Mongoose connected")).catch(err => console.log("mongoose Err:", err))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './temp/my-uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        return cb(null, file.fieldname + '-' + uniqueSuffix)
    },
})

const upload = multer({ storage: storage, })

app.use('/auth', authRouter)
app.use('/users', authenticationToken, userRouter)

app.get(`/`, (req, res) => {
    return res.render('home', { port })
})
app.post(`/upload`, upload.single('imageFile'), (req, res) => {
    console.log(req.body)
    console.log(req.file)
    return res.send(`File uploaded successfully: ${req.file.originalname}`)
})

app.listen(port, () => {
    console.log(`App listening on localhost:${port}`)
})