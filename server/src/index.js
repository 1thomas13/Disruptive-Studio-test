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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = __importDefault(require("./routes/users"));
const contentTypes_1 = __importDefault(require("./routes/contentTypes"));
const categories_1 = __importDefault(require("./routes/categories"));
const content_1 = __importDefault(require("./routes/content"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const helpers_1 = require("./helpers");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const PORT = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const mongoDB = process.env.MONGODB_URI;
if (!mongoDB) {
    console.error('MONGODB_URI is not defined in .env file');
    process.exit(1);
}
mongoose_1.default.connect(mongoDB)
    .then(() => {
    console.log('Connected to MongoDB database');
})
    .catch((error) => {
    console.error('Connection error:', error);
});
app.use('/api/users', users_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/contentType', contentTypes_1.default);
app.use('/api/content', content_1.default);
app.use('/api/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.get('/', (_, res) => res.send('OK'));
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    socket.on('requestCounts', (selectedCategory) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const counts = yield (0, helpers_1.getCountsForCategory)(selectedCategory);
            socket.emit('countsUpdate', counts);
        }
        catch (error) {
            console.error('Error handling requestCounts:', error);
            socket.emit('countsUpdate', { imagesCount: 0, linksCount: 0, filesCount: 0 });
        }
    }));
});
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
