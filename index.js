const express = require("express");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const rotaUsuario = require('./rotas/usuarios');
const rotaAutorizar = require('./rotas/autorizar');
const rotaPublicacao = require('./rotas/publicacoes');


dotenv.config();



mongoose.connect(
    process.env.MONGO_URL,
    () => {
        console.log("Conexão ao mongo");
    }
);





// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use('/api/usuarios', rotaUsuario);
app.use('/api/autorizar', rotaAutorizar);
app.use('/api/publicacoes', rotaPublicacao);




app.listen(8800, () => {
    console.log("Servidor backend está executando!")
})