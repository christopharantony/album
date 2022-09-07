const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { notfound, errorHandler } = require("./Server/Middlewares/ErrorMiddleware");

const connectDB = require('./server/Database/connection');
const port = process.env.PORT;

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

//log requests....................
app.use(morgan('tiny'));
app.use(express.json());

//mongodb connection...............
connectDB();

//parse json bodies...............
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes..........................
app.use('/album', require('./server/routes/albumRouter'));
app.use('/user', require('./server/Routes/userRouter'));

// error handlers................
app.use(notfound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

