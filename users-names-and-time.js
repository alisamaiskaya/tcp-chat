const fs = require('fs').promises;

function formatDate (date) {
    let fullDate = `${date.getHours()}hr.${date.getMinutes()}min.${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
    return `You was in chat ${fullDate}`;
}

class Logins {
    async saveLogin (login, time) {
        await fs.appendFile('/Users/alisa/projects/tcp-chart/user-logins.md', `[${login}]: ${formatDate(time)}\n`);
    }

    async getArrOfLogs () {
        let finalArr = [];
        const data = await fs.readFile('/Users/alisa/projects/tcp-chart/user-logins.md', 'utf8');
        const arrOfStrs = data.split('\n');

        let login = '';
        let timeStr = '';
        let string = '';
        let lengthArr = arrOfStrs.length - 1; //не берём последнюю строку, в которой по факту /n
        let obj = { 
            login,
            timeStr,
        };
    

        for (let i = 0; i < lengthArr; i+=1) {
            string = arrOfStrs[i];
            login = string.match(/\w+/m)[0];//or /\[\w+\]/
            obj.login = login;

            const timeArr = string.match(/\d+/g);
            const [hours, srcMinuties, day, month, year] = timeArr;
            let minuties = srcMinuties;

            if (minuties.length === 1) {
                minuties = '0' + minuties;
            }
            
            timeStr = `${hours}:${minuties} ${day}.${month}.${year}`;
            obj.timeStr = timeStr;

            finalArr.push(obj);
            
        }
        return finalArr;
    }

    async sendYourVisitingTime (name) {
        let visitingTime = '';
        const logsAndTime  = await this.getArrOfLogs();
    
        for (let i = logsAndTime.length-1; i>=0; i-=1) {
            // let oneObject = logsAndTime[i];
            logsAndTime[i].find((oneObject) => {
                if (oneObject.login === name) {
                    visitingTime = oneObject.timeStr;
                }
            })
        }
        return `You was in chat ${visitingTime}`;
    }
}

// const log = new Logins();
// log.sendYourVisitingTime('Alisa').then(result => {
//    console.log(result); 
// });


// loginsLog.find((user) => {
//     return user.login === 'myLogin';
// });
// написать объект, читать по ключу значение времени


module.exports = Logins;