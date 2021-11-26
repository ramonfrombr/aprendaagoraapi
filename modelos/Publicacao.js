const mongoose = require('mongoose');

const PublicacaoSchema = new mongoose.Schema(
    {
        usuario_id: {
            type: String,
            require: true,
        },
        titulo: {
            type: String,
        },
        conteudo: {
            type: String,
            max: 500,
        },
        imagem: {
            type: String,
        },
        likes: {
            type: Array,
            default: []
        },
    },
    {timestamps: true},
);


module.exports = mongoose.model(
    "Publicacao",
    PublicacaoSchema,
    "publicacoes"
);
