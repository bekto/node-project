import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const SERVER_TOKEN_EXPIRE_TIME = process.env.SERVER_TOKEN_EXPIRE_TIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "Issuer";
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "addsuperencryptedsecret";

const MONGO_URL = process.env.MONGO_HOST || "mongodb://mongo:27017/node"

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 35000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: true,
    useFindAndModify: false
}

const MONGO = {
    options: MONGO_OPTIONS,
    url: MONGO_URL 
}

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRE_TIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

const config = {
    server: SERVER,
    mongo: MONGO
};

export default config;
