const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes');

const port = process.env.PORT || 8080;
const app = express();

const CORS_OPTIONS = {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true
};

app.use(bodyParser.json());
app.use(cors(CORS_OPTIONS));
app.use(router);

const server = http.createServer(app);

const io = socketIo(server);

let messages = [];
let userList = [];

io.on('connection', socket => {
	socket.emit('readAllMessages', messages);
	socket.on('newMessage', message => {
		messages.push(message);
		socket.broadcast.emit('readOneMessage', message);
	});
	socket.on('privateMessage', data => {
		socket.to(data.id).emit('readOneMessage', data.message);
	});
	socket.on('username', username => {
		userList.push({ id: socket.id, username });
		io.emit('listUsers', userList);
	});
	socket.on('disconnect', () => {
		const user = userList.find(user => user.id === socket.id);
		if (user)
			console.log(`${user.username} disconnected`);
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
