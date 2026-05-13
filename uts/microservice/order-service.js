const express = require('express');
const amqp = require('amqplib');

const app = express(); // Perbaikan: tambah ()
app.use(express.json()); // Perbaikan: ganti - jadi .

const HTTP_PORT = process.env.PORT || 3000;
let orders = [];
let channel; // Variable global agar bisa diakses di route POST

async function connectRabbitMQ() {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    
    try {
        const connection = await amqp.connect(rabbitUrl);
        channel = await connection.createChannel(); // Simpan channel ke variabel global
        
        // Pastikan queue tersedia
        await channel.assertQueue('order_created', { durable: true });
        
        console.log(" [✓] Order Service terhubung ke RabbitMQ di:", rabbitUrl);
    } catch (error) {
        console.error(" [X] Koneksi RabbitMQ gagal, mencoba lagi dalam 5 detik...");
        setTimeout(connectRabbitMQ, 5000);
    }
}

connectRabbitMQ();

// GET: Cek daftar order
app.get('/orders', (req, res) => {
    res.json(orders);
});

// POST: Buat order baru dan kirim event
app.post('/orders', async (req, res) => {
    const order = {
        id: orders.length + 1, 
        userId: req.body.userId,
        product: req.body.product
    };

    orders.push(order);

    // Kirim event ke RabbitMQ jika channel sudah siap
    if (channel) {
        channel.sendToQueue(
            'order_created', // Perbaikan: hapus spasi
            Buffer.from(JSON.stringify(order)),
            { persistent: true } // Pesan tetap aman jika RabbitMQ restart
        );
        console.log(" [➔] Event dikirim ke RabbitMQ:", order);
    } else {
        console.error(" [!] Gagal mengirim event: Channel RabbitMQ belum siap");
    }

    res.status(201).json(order);
});

app.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`Order Service running at http://0.0.0.0:${HTTP_PORT}`);
});

// const express = require('express');
// const amqp = require ('amqplib');

// const app = express;
// app. use(express-json());

// let orders = [];
// let channel;

// // koneksi ke RabbitMQ
// async function connectRabbitMQ() {

//     const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    
//     try {
//         const connection = await amqp.connect(rabbitUrl);
//         console.log("Connected to RabbitMQ at", rabbitUrl);
//         // ... rest of your logic
//     } catch (error) {
//         console.error("Connection failed, retrying in 5s...");
//         setTimeout(connectRabbitMQ, 5000); // Important: Docker containers often start before RabbitMQ is ready
//     }
//     // const connection = await amqp.connect('amqp://0.0.0.0:5672');
//     //     channel = await connection.createChannel();
        
//     //     await channel.assertQueue('order_created'); 
//     //     console.log("Terhubung ke RabbitMQ");
// }
//         connectRabbitMQ();
//     app-get('/orders', (req, res) => {
//         res. json(orders);
        
//     }) ;
// // POST
// app.post('/orders', async (req, res) => {
//     const order = {
//         id: orders.length + 1, 
//         userId: req.body.userId,
//         product: req.body.product
//     };

//     orders.push(order);
//     // kirim event
//     channel.sendToQueue (
//     'order _created',
//     Buffer.from(JSON.stringify(order))
//     );

//     console.log("Event dikirim:", order);
//     res.json (order);
// });

// app. listen (HTTP_PORT, '0.0.0.0', () => {
// console. log(`Order Service running at http://0.0.0.0:${HTTP_PORT}`)});