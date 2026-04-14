const WebSocket = require("ws");

const wss = new WebSocket.Server({ host: "0.0.0.0", port: 8002 });

// store clients
const clients = new Map(); 
// user_id → ws

// rooms
const rooms = {}; 
// room_id → Set(ws)

// helper: join room
function joinRoom(ws, room) {
  if (!rooms[room]) {
    rooms[room] = new Set();
  }
  rooms[room].add(ws);
}

// helper: leave all rooms
function leaveAllRooms(ws) {
  for (const room in rooms) {
    rooms[room].delete(ws);
  }
}

// helper: broadcast
function broadcastToRoom(room, message) {
  if (!rooms[room]) return;

  rooms[room].forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      // =========================
      // 1. AUTH / INIT CONNECTION
      // =========================
      if (data.type === "INIT") {
        const { user_id, class_id } = data;

        ws.user = { user_id, class_id };

        // save client
        clients.set(user_id, ws);

        // auto join class room
        joinRoom(ws, `class_${class_id}`);

        console.log(`User ${user_id} joined class_${class_id}`);
      }

      // =========================
      // 2. JOIN CHAT ROOM
      // =========================
      if (data.type === "JOIN_CHAT") {
        const { room_id } = data;

        joinRoom(ws, room_id);

        console.log(`User joined chat room ${room_id}`);
      }

      // =========================
      // 3. SEND CHAT MESSAGE
      // =========================
      if (data.type === "SEND_CHAT") {
        const payload = {
          type: "NEW_CHAT",
          data: {
            room_id: data.room_id,
            sender: ws.user.user_id,
            message: data.message,
            time: new Date()
          }
        };

        broadcastToRoom(data.room_id, payload);
      }

      // =========================
      // 4. CREATE TASK (LECTURER)
      // =========================
      if (data.type === "CREATE_TASK") {
        const { title, deadline, class_id } = data;

        const payload = {
          type: "NEW_TASK",
          data: {
            title,
            deadline,
            class_id
          }
        };

        // send to all students in class
        broadcastToRoom(`class_${class_id}`, payload);

        console.log(`Task sent to class_${class_id}`);
      }

    } catch (err) {
      console.error("Invalid message:", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");

    if (ws.user) {
      clients.delete(ws.user.user_id);
    }

    leaveAllRooms(ws);
  });
});

console.log("WebSocket server running on ws://localhost:3000");