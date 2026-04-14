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
const PROTO_PATH = './user.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const user_proto = grpc.loadPackageDefinition(packageDefinition).api;

function GetUserProfile(call, callback) {
    callback(null, { message: 'User: ' + call.request.name });
}

const grpcServer = new grpc.Server(); // Renamed to avoid collision
grpcServer.addService(user_proto.UserService.service, { GetUserProfile: GetUserProfile });

grpcServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(`gRPC bind failed: ${error.message}`);
        return;
    }
    console.log(`gRPC Server running at 0.0.0.0:50051`);
    grpcServer.start();
});

// --- 3. WebSocket Setup ---
// Using port 8000 as per your Docker Compose
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8000 });

wss.on('connection', socket => {
    console.log("New WS Client connected");
    socket.on('message', message => {
        console.log("Pesan diterima:", message.toString());
        socket.send("Pesan diterima server");
    });
});
console.log('WebSocket Server running at ws://0.0.0.0:8000');

// --- 4. Start Express Server (FIXES ERR_CONNECTION_RESET) ---
const HTTP_PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('API is running...'));

app.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`HTTP Server running at http://0.0.0.0:${HTTP_PORT}`);
});
// const fs = require('fs');
// const yaml = require('js-yaml');
// const cors = require('cors');
// const express = require('express');
// const app = express();
// app.use(cors());
// app.use(express.json());

// const WebSocket = require('ws');
// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');

// // 1. Load Configuration
// const config = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));

// // 2. gRPC Setup
// // Ensure PROTO_PATH and the service name match your user.proto
// const PROTO_PATH = './user.proto';
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//     keepCase: true,
//     longs: String,
//     enums: String,
//     defaults: true,
//     oneofs: true
// });

// // Accessing the service definition 
// const user_proto = grpc.loadPackageDefinition(packageDefinition).api;

// function GetUserProfile(call, callback) {
//     // Make sure your user.proto message has a field named "name"
//     callback(null, { message: 'User: ' + call.request.name });
// }

// const server = new grpc.Server();
// server.addService(user_proto.UserService.service, { GetUserProfile: GetUserProfile });

// // CHANGE: Bind to 0.0.0.0 instead of localhost
// server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
//     if (error) {
//         console.error(`Server failed to bind: ${error.message}`);
//         return;
//     }
//     console.log(`gRPC Server running at http://0.0.0.0:${port}`);
//     server.start(); // Ensure the server starts processing
// });

// // 3. WebSocket Setup
// const wss = new WebSocket.Server({host: '0.0.0.0', port: 8000});
// // const wss = new WebSocket.Server({ port: 3000 });

// // // const server = new WebSocket.Server({ port: 3000 });

// wss.on('connection', socket => {
//     socket.on('message', message => {
//         console. log("Pesan diterima:", message);
//         socket.send ("Pesan diterima server");
//         });
//     });