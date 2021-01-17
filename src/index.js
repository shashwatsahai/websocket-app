const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const path = require('path')


let clients = [];

const wss = new WebSocket.Server({ server });

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client/')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/../client');

app.post('/chat', (req, res) => {
    var user = req.body.name;
    res.render("chat",{user:user})
})

app.get('/clients', (req, res) => {
    res.json(
        clients.map((client) => client.name)    
    )
})

wss.on('connection', (ws) => {
    console.log("Client connected");
   
    ws.on('message', (msg) => {
        let recdMsg = JSON.parse(msg)
     
        switch(recdMsg.type){
            case 'register': {
                clients.push({
                    ws,
                    name: recdMsg.name
                })
            }
            break;
            case 'messageSent': {
                clients.forEach((client) => {
                    if(client.ws != ws){
                        let obj = {
                            type: 'messageRecd',
                            author: recdMsg.author,
                            messageContent: recdMsg.messageContent
                        }
                        client.ws.send(JSON.stringify(obj))
                    }
                })
            }
            break;
            // case 'messageRecd': {
            //     console.log("MESSAGE RECIEVED FOR",ws.name);
            // }
            // break;
        }
        ws.send(JSON.stringify({type:'pong'}));
    }); 

    ws.on('ping', (user) => {
        console.log("USER",user)
        clients.push({
            ws,
            name: user
        })
    });

    ws.on('close', () => {
        clients = clients.filter((client) => client.ws!=ws)
    })
});


server.listen(3000, () => {
    console.log("LISTN on 3000");
})