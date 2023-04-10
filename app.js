//app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');

app.use(cors());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());


var dir = path.join(__dirname, 'images');

app.use('/images', express.static(dir));

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Servidor de imagens de prefeitos e vereadores na porta ${port}`)
})
