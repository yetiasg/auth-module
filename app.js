const createError = require('http-errors');
const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const { initDB } = require('./helpers/db-connection');
const authRoute = require('./routes/auth');
const {verifyAccessToken} = require('./helpers/jwt_helper');


const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
  
app.use('/auth', authRoute);

app.get('/', async(req, res, next) => {
    res.status(200).json({message: 'Hello from root route'});
});

app.get('/protected', verifyAccessToken, async(req, res, next) => {
    res.status(200).json({message: 'Hello from protected route'});
})

app.use(async (req, res, next) => {
    res.status(404).json('This route does not exist');
    next(createError.NotFound('This route does not exist'));
  });

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
        status: err.status || 500,
        message: err.message,
        },
    });
});

initDB((err) => {
    const PORT = config.PORT || 3001;
    if (!err) {
      app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
      });
    } else {
      console.log(`Connection failed. err: ${err}`);
    }
});
  