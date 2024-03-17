const amqp = require('amqplib');

async function consumeMessages(){
    // 1-Connect to the rabbitmq server
    const connection = await amqp.connect('amqp://localhost');

    // 2-Create a new channel
    const channel = await connection.createChannel();

    // 3-Create the exchange
    await channel.assertExchange('logExchange', 'direct');

    // 4-Create the queue
    const q = await channel.assertQueue('InfoQueue');

    // 5-Bind the queue to the exchange
    await channel.bindQueue(q.queue, 'logExchange', 'Info');

    // 6-Consume messages from the queue
    channel.consume(q.queue, (msg)=>{
        const data = JSON.parse(msg.content);
        console.log(data);
        channel.ack(msg);
    });
}