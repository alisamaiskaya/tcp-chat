const net = require('net');
const User = require ('./user.js');
const port = 1256;
const host = '0.0.0.0'; //localhost
const users = {};

function broadcast (message, senderName) {
    for (let userName in users)  {
        if (userName !== senderName) {
            users[userName].sendMessage(message);
        }
    }
}

const server = net.createServer(async (socket) => {
    // На этот момент клиент уже подключился
    const client = new User(socket);

    while (true) {
        client.sendMessage('Enter your nickname: ');
        const name = await client.waitReply();

        if (name.length > 3) {
            client.name = name;
            break;
        }
    }
    
    users[client.name] = client; // добавляем каждого нового клиента в объект users

    client.enterToChat(broadcast, users);

    socket.on('end', () => {
        console.log('Connection is closed');
        delete users[client.name];
    });
});

server.listen (port, host, () => {
    console.log('Server is listening');
});


// 
