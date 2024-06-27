import { bindQueue, connect, consume, createExchange, createTempQueue } from "./mq";

const exchange = 'queueing-notifications-sandbox-dev';

export const subscriber = async () => {

    const channel = await connect();

    await createExchange(channel, exchange);

    const queue = await createTempQueue(channel);

    await bindQueue(channel, exchange, queue);
    
    await consume(channel, queue, msg => {
        console.log(msg);
    });
};

subscriber();
