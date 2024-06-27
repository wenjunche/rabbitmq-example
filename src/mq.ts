import amqp from 'amqplib/callback_api';
import * as dotenv from "dotenv";

dotenv.config();

export const connect = async (): Promise<amqp.Channel> => {
    return new Promise<amqp.Channel>((res, rej) => {
        amqp.connect({
            protocol: 'amqps',
            hostname: process.env.MQ_HOSTNAME,
            port: parseInt(process.env.MQ_PORT),
            username: process.env.MQ_USERNAME,
            password: process.env.MQ_PASSWORD,
            vhost: process.env.MQ_VHOST
        }, function(err, connection) {
            if (err) {
                console.error('Error connecting', err);
                rej(err);
            } else {
                console.log('connected');
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        console.error('Error creating channel', err);
                        rej(error1);
                    } else {
                        console.log('channel created');
                        res(channel)
                    }        
                });
            }
        });
    });
};

export const createQueue = async (channel: amqp.Channel, name: string): Promise<void> => {
    return new Promise<void>((res, rej) => {
        channel.assertQueue(name, {
            durable: false
        }, function(err, queue) {
            if (err) {
                rej(err)
            } else {
                res();
            }  
        });
    });
};

export const sendToQueue = (channel: amqp.Channel, queue: string, message: unknown): boolean => {
    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

export const consume = async (channel: amqp.Channel, queue: string, listener: (message: string)=>void): Promise<string> => {
    return new Promise<string>((res, rej) => {
        channel.consume(queue, function(msg) {
            listener(msg.content.toString());
        }, { 
            noAck: true  // auto ack
        }, function(err, resp) {
            if (err) {
                rej(err);
            } else {
                res(resp.consumerTag);
            }
        });
    });
}

export const createExchange = async (channel: amqp.Channel, name: string): Promise<void> => {
    return new Promise<void>((res, rej) => {
        channel.assertExchange(name, 'fanout', {
            durable: false
        }, function(err, queue) {
            if (err) {
                rej(err)
            } else {
                res();
            }  
        });
    });
};

export const createTempQueue = async (channel: amqp.Channel): Promise<string> => {
    return new Promise<string>((res, rej) => {
        channel.assertQueue('', {
            durable: false,
            exclusive: true,
        }, function(err, queue) {
            if (err) {
                rej(err)
            } else {
                res(queue.queue);
            }  
        });
    });
};

export const bindQueue = async (channel: amqp.Channel, exchange: string, queue: string): Promise<void> => {
    return new Promise<void>((res, rej) => {
        channel.bindQueue(queue, exchange, '', {}, function(err, resp) {
            if (err) {
                rej(err)
            } else {
                res();
            }  
        });
    });
};

export const publish = (channel: amqp.Channel, exchange: string, message: unknown): boolean => {
    return channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));
}
