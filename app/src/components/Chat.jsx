import React, { useState, useEffect, useContext } from 'react';
import shortid from 'shortid';
import socketContext from './socketContext';

const Chat = ({ nickname }) => {

	const [messageValue, setMessageValue] = useState('');
	const [messageList, setMessageList] = useState([]);
	const socket = useContext(socketContext);

	useEffect(() => {
		socket.on('readAllMessages', messages => {
			setMessageList(messages);
		});
		socket.on('readOneMessage', message => {
			setMessageList(messageList => [...messageList, message]);
		});
	}, [socket]);

	const sendMessage = () => {
		const obj = { nickname, message: messageValue }
		socket.emit('newMessage', obj);
		setMessageList(messageList => [...messageList, obj]);
	}

	return (
		<div>
			<ul id="messagesList">
				{messageList.map(message =>
					<li key={shortid.generate()}>{`${message.nickname}: ${message.message}`}</li>
				)}
			</ul>
			<form onSubmit={e => e.preventDefault()}>
				<input autoComplete="off" value={messageValue} onChange={e => setMessageValue(e.target.value)} />
				<button onClick={sendMessage}>Send</button>
			</form>
		</div>
	)
}

export default Chat;