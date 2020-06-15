import React, { useState } from 'react';
import SocketContext from './components/socketContext';
import SocketIo from 'socket.io-client';
import Form from './components/Form';
import Chat from './components/Chat';

const App = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [nickname, setNickname] = useState('');

  const submitNickname = name => {
    setNickname(name);
    setIsLogged(true);
  }

  return (
    <SocketContext.Provider value={SocketIo('http://localhost:8080')}>
      {isLogged ? <Chat nickname={nickname} /> : <Form onSubmit={submitNickname} />}
    </SocketContext.Provider>
  );
}

export default App;
