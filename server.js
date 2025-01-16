const net = require('net');
const fs = require('fs');

const log = fs.createWriteStream('chat.log', { flags: 'a' });

const server = net.createServer((socket) => {
  this.clients = this.clients || [];

  socket.on('data', (data) => {
    const { type, value } = JSON.parse(data);
    if (type === 'connection') {
      socket.username = value;
      console.log(`${socket.username} joined`);
      log.write(`${socket.username} joined\n`);
      socket.write(JSON.stringify({ type: 'server-message', value: 'Welcome to the chat\nType -exit to exit' }));
      if (this.clients.length) {
        this.clients.forEach((client) => {
          client.write(JSON.stringify({ type: 'server-message', value: `${socket.username} joined` }));
        });
      }
      this.clients.push(socket);
    } else if (type === 'message') {
      console.log(`${socket.username}: ${value}`);
      this.clients.forEach((client) => {
        if (client.username !== socket.username) {
          client.write(JSON.stringify({ type: 'client-message', value, username: socket.username }));
        }
      });
      log.write(`${socket.username}: ${value}\n`);
    }
  });

  socket.on('end', () => {
    console.log(`${socket.username} disconnected`);
    log.write(`${socket.username} disconnected\n`);
    this.clients.filter((client) => client !== socket).forEach((client) => {
      client.write(JSON.stringify({ type: 'server-message', value: `${socket.username} disconnected` }));
    });
    this.clients = this.clients.filter((client) => client !== socket);
  });
}).listen(3000, () => {});

server.on('error', (error) => {
  console.error('Error:', error);
});

server.on('close', () => {
  console.log('Server closed');
  process.exit(0);
});