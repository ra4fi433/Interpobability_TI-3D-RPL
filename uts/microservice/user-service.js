const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 3000;

app.use (express.json());
    let users = [
        { id: 1, name: "Budi" }
    ];

app.get('/users', (req, res) => {
    res. json (users);
}) ;
app.post('/users', (req, res) => {
const user = {
    id: users.length + 1,
    name: req.body.name
};
    users.push(user);
    res.json(user);
});

app.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`User Service running at http://0.0.0.0:${HTTP_PORT}`);
});
