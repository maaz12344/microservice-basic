
const amqp = require('amqplib');

async function start() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq');

        const channel = await connection.createChannel();

        await channel.assertQueue('task_created', {
            durable: true
        });

        console.log('Notification service is listening...');

        channel.consume('task_created', (message) => {

            if (message !== null) {
                try {
                    const task = JSON.parse(
                        message.content.toString()
                    );

                    console.log('Received task:', task);

                    channel.ack(message);

                } catch (err) {
                    console.error('Message processing failed:', err);

                    // Reject invalid message without requeueing
                    channel.nack(message, false, false);
                }
            }

        });

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
        });

        connection.on('close', () => {
            console.error('RabbitMQ connection closed. Restarting...');
            setTimeout(start, 5000);
        });

    } catch (err) {
        console.error(
            'Failed to connect to RabbitMQ. Retrying in 5 seconds...',
            err.message
        );

        setTimeout(start, 5000);
    }
}

start();
