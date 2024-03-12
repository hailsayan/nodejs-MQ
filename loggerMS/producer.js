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
            await this.createChannel ();
        }

        // create the exchange
        const exchangeName = config.rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, 'direct');

        // publish the message to the exchange with a routing key
        const logDatails = {
            logType: routingKey,
            message: message,
            dateTime: new Date(),
        };
        await this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(
                JSON.stringify(logDatails)
            )
        );

        console.log(`the message ${message} is sent to exchange ${exchangeName}`);
    }
}

module.exports = Producer;