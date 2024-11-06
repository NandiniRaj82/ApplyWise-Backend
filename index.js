const express = require("express");
const app = express();
const PORT = 3000;
const connectDB = require('./Config/db.js');
const router = require('./router'); 

connectDB();

app.use(express.json());

app.use('/', router);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));