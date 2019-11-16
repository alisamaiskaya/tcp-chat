const Logins = require('./users-names-and-time');

const login = new Logins();

class User {
    constructor (socket) {
        this.name = null;//он же logim
        this.socket = socket;
        this.connectionTime = new Date();
    }

    sendMessage (string) { //отправляется юзеру
        this.socket.write(string);
    };

     waitReply () { 
        return new Promise ((resolve, reject) => {
            this.socket.on('data', (buff) => {
                const message = buff.toString().slice(0, -1);
                resolve(message);
            });
            this.socket.once('error', (err) => {
                reject(err);
            });
        });
    }

    enterToChat (sendAllClients, users) { // по аналогии с авторизацией,  аргумент 
        //он же broadcast
        login.saveLogin(this.name, this.connectionTime);
        this.socket.on('data', async (buff) => {
            const message = buff.toString().slice(0, -1);

            if (message.length === 0) {
                return;
            }

            if (message === '\\time') {
                this.sendMessage(`${Date.now() - this.connectionTime}\n`);
                return;
            }

            if (message === '\\mvt') {
                const mess = await login.sendYourVisitingTime(this.name);
                this.sendMessage(`Hi, ${mess}`);
                return;
            }

            if (message === '\\wio') {
                for (const key in users)  {
                    if (key !== this.name) {
                        this.sendMessage(`${users[key].name}\n`);
                    }
                }
                return;
            }
            
            sendAllClients(`[${this.name}] ${message}\n`, this.name);
        })
    }

}


// \time
// 56780987
module.exports = User;