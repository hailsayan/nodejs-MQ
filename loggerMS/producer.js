const amqp = require('amqplib');
const config = require('./config');

class Producer {
    channel;

    // connect to the rabbitmq server
    async createChannel () {
        const connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    // create a new channel on that connection 1
    async publishMessage (routingKey, message) {
        if (!this.channel) {
            this.createChannel ();
        }

        // create the exchange
        const exchangeName = config.rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, 'direct');

        // publish the message to the exchange with a routing key
        await this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(
                JSON.stringify({
                    logType: routingKey,
                    message: message,
                    dateTime: new Date(),
                })
            )
        )
    }
}