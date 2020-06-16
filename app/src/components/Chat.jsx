import React, { useState, useEffect, useContext } from 'react';
import shortid from 'shortid';
import Select from 'react-select';
import socketContext from './socketContext';

const Chat = ({ nickname }) => {

	const [messageValue, setMessageValue] = useState('');
	const [messageList, setMessageList] = useState([]);
	const [userList, setUserList] = useState([]);
	const [dest, setDest] = useState(null);
	const socket = useContext(socketContext);

	useEffect(() => {
		socket.emit('username', nickname);
		socket.on('listUsers', list => {
			console.log(list)
			const tmp = [{ label: 'General', value: null }];
			list.forEach(user => {
				tmp.push({ label: user.username, value: user.id })
			});
			setUserList(tmp);
		});
		socket.on('readAllMessages', messages => {
			setMessageList(messages);
		});
		socket.on('readOneMessage', message => {
			setMessageList(messageList => [...messageList, message]);
		});
	}, [socket]);

	const sendMessage = () => {
		const obj = { nickname, message: messageValue }
		if (!dest)
			socket.emit('newMessage', obj);
		else
			socket.emit('privateMessage', { id: dest, message: obj });
		setMessageList(messageList => [...messageList, obj]);
	}

	return (
		<div>
			<h1>{nickname}</h1>
			<ul id="messagesList">
				{messageList.map(message =>
					<li key={shortid.generate()}>{`${message.nickname}: ${message.message}`}</li>
				)}
			</ul>
			<form onSubmit={e => e.preventDefault()}>
				<input autoComplete="off" value={messageValue} onChange={e => setMessageValue(e.target.value)} />
				<button onClick={sendMessage}>Send</button>
			</form>
			<Select options={userList} onChange={value => setDest(value.value)} />
		</div>
	)
}

export default Chat;