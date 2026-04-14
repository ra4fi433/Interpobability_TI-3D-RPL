const fs = require('fs');
const yaml = require('js-yaml');
const cors = require('cors');
const express = require('express');
const WebSocket = require('ws');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. Load Configuration ---
try {
    const config = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));
    console.log("YAML Config Loaded");
} catch (e) {
    console.error("Failed to load YAML:", e.message);
}

// --- 2. gRPC Setup ---
const PROTO_PATH = './product.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const product_proto = grpc.loadPackageDefinition(packageDefinition).api;

function GetProduct(call, callback) {
    callback(null, { message: 'Product: ' + call.request.name });
}

function CreateProduct(call, callback) {
    callback(null, { message: 'Create Product: ' + call.request.name });
}

const grpcServer = new grpc.Server(); // Renamed to avoid collision
grpcServer.addService(product_proto.ProductService.service, { GetProduct: GetProduct, CreateProduct: CreateProduct });

grpcServer.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(`gRPC bind failed: ${error.message}`);
        return;
    }
    console.log(`gRPC Server running at 0.0.0.0:50052`);
    grpcServer.start();
});


// --- 3. WebSocket Setup ---
// Using port 8002 as per your Docker Compose
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8002 });
wss.on('connection', socket => {
    console.log("Client linked for notifications");

    socket.on('message', data => {
        try {
            const payload = JSON.parse(data);

            switch(payload.type) {
                case 'NEW_ASSIGNMENT':
                    console.log(`Notification: New Task - ${payload.title}`);
                    // Logic to save to DB or broadcast would go here
                    socket.send(JSON.stringify({ status: "success", msg: "Assignment Notif Sent" }));
                    break;

                case 'CHAT_MESSAGE':
                    console.log(`Notification: Chat from ${payload.sender}: ${payload.text}`);
                    socket.send(JSON.stringify({ status: "success", msg: "Chat Notif Sent" }));
                    break;

                default:
                    console.log("Unknown notification type");
            }
        } catch (e) {
            console.error("Invalid JSON format received");
        }
    });
});

console.log('WebSocket Server running at ws://0.0.0.0:8002');

// --- 4. Start Express Server (FIXES ERR_CONNECTION_RESET) ---
const HTTP_PORT = process.env.PORT || 3001;
app.get('/', (req, res) => res.send('API is running...'));

app.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`HTTP Server running at http://0.0.0.0:${HTTP_PORT}`);
});
