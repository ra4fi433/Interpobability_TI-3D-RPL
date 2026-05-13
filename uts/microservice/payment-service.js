 const amqp = require('amqplib');

async function start() {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    
    try {
        const connection = await amqp.connect(rabbitUrl);
        const channel = await connection.createChannel();

        const queue = 'order_created';
        await channel.assertQueue(queue, { durable: true });
        
        console.log(" [*] Menunggu event di queue:", queue);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                console.log(" [➔] Proses pembayaran untuk:", order);

                setTimeout(() => {
                    console.log(" [✓] Pembayaran sukses untuk ID:", order.id);
                    // Beritahu RabbitMQ bahwa pesan sukses diproses
                    channel.ack(msg);
                }, 2000);
            }
        });
    } catch (error) {
        console.error(" [!] Gagal konek RabbitMQ, mencoba lagi dalam 5 detik...");
        setTimeout(start, 5000);
    }
}

start();

// const amap = require('amaplib');

// async function start() {
    
//     const connection = await amqp.connect ('amqp://0.0.0.0:5672');
//     const channel = await connection.createChannel();

//     await channel.assertQueue('order_created');
//     console.log("Menunggu event...");

// channel. consume( 'order_created', (msg) => {
//         const order = JSON.parse(msg.content.toString());

//     console.log(" Proses pembayaran:", order);

// setTimeout(() => {
//         console.log("Pembayaran sukses untuk order:", order.id);
//     }, 2000);

//     channel.ack(msg);
// });

// }
// start();