const express = require('express');

const router = express.Router();

router.get('/', (_, res) => {
	res.status(200).send('Bienvenue sur ma super API');
});

module.exports = router;