import { connect, createQueue, sendToQueue } from "./mq";

const queue = 'queueing-notifications-sandbox-dev';

export const producer = async () => {

    const channel = await connect();

    await createQueue(channel, queue);
    
    sendToQueue(channel, queue, {ticker: 'ICE', price: Math.random() * 100});
};

producer();