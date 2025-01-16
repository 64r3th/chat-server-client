const net = require('net');


const username = process.argv[2];
if (!username) {
  console.error('Please provide a username');
  process.exit(1);
}

const client = net.createConnection(3000, 'localhost', () => {
  console.log('Connected to server');
  this.username = username;
  client.write(JSON.stringify({ type: 'connection', value: username }));
});

client.on('data', (data) => {
  const { type, value, username } = JSON.parse(data);
  if (type === 'client-message') {
    console.log(`${username}: ${value}`);
  } else if (type === 'server-message') {
    console.log('Server:', value);
  }
});

process.stdin.on('data', (data) => {
  if (data.toString().trim() === '-exit') {
    client.end();
    return;
  }
  client.write(JSON.stringify({ type: 'message', value: data.toString().trim() }));
});

client.on('error', (error) => {
  console.error('Error:', error);
});

client.on('end', () => {
  console.log('Disconnected from server');
  process.exit(0);
});