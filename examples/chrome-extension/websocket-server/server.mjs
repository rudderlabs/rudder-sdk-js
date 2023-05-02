import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    try {
      const event = JSON.parse(data)
      console.log('received: %s', event.data.batch[0]);
      event.done();
    } catch (e) {
      console.log('received: %s', data);
    }
  });

  ws.send('something');
});
