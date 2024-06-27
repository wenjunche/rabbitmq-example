import { connect, createExchange, publish } from "./mq";

const exchange = 'queueing-notifications-sandbox-dev';

export const publisher = async () => {

    const channel = await connect();

    await createExchange(channel, exchange);
    
    const resp = publish(channel, exchange, {ticker: 'ICE', price: Math.random() * 100});
    console.log('after publishing', resp);
};

publisher();