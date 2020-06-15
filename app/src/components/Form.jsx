import React, { useState } from 'react';

const Form = ({ onSubmit }) => {
	const [nickname, setNickname] = useState('');

	return (
		<div id="auth">
			<label>Enter your nickname :</label>
			<input type="text" value={nickname} onChange={e => setNickname(e.target.value)} />
			<button onClick={() => onSubmit(nickname)}>Submit</button>
		</div>
	);
}

export default Form;