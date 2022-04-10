const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();

router.get('/*', (req, res) => {
    console.log(`Rendering index`);
    res.render('index');
});

app.use(express.static(path.join(__dirname, './public')));

// CONNECT
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Application started on port ${port}.`);
});