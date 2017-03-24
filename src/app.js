const express = require('express');

const app = express();

app.get('/', (request, response) => {
    response.send({
        Done: true
    });
});

app.listen(80, () => {
    console.log('Server is up at http://localhost');
});