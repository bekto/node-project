import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import logging from './config/logging';
import config from './config/config';
import userRoutes from './routes/user';
import shoppingCartRouter from './routes/shopping_cart';

const NAMESPACE = 'Server';
const router = express();

// connecting to mongodb
mongoose.connect(config.mongo.url, config.mongo.options)
.then(result => {
    logging.info(NAMESPACE, 'Connected to MongoDB successfully!')
})
.catch(error => {
    logging.error(NAMESPACE, error.message, error)
})

// logging req and res
router.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    })
    
    next();
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

// Routes
router.use('/users', userRoutes);
router.use('/cart', shoppingCartRouter)

router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));
