"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./app/config"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFoundRoutes_1 = __importDefault(require("./app/middlewares/notFoundRoutes"));
const routers_1 = __importDefault(require("./app/routers"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: [`${config_1.default.frontend_prodution_url}`, "http://localhost:3000"], credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// When server starts and hit root path
app.get('/', (req, res) => {
    res.send('Welcome to the Stationery Shop');
});
// Apply router middleware to all routes under '/api'
app.use('/api', routers_1.default);
// Global Error Handler
app.use(globalErrorHandler_1.default);
// handle api not found error
app.use((req, res, next) => {
    (0, notFoundRoutes_1.default)(req, res, next);
});
exports.default = app;
