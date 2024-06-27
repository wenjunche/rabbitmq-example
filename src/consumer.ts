import { connect, consume, createQueue } from "./mq";

const queue = 'queueing-notifications-sandbox-dev';

export const consumer = async () => {

    const channel = await connect();

    await createQueue(channel, queue);
    
    await consume(channel, queue, msg => {
        console.log(msg);
    });
};

consumer();
