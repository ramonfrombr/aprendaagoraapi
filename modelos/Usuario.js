const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema(
    {
        nome_usuario: {
            type: String,
            require: true,
            min: 3,
            max: 20,
            unique: true
        },
        email: {
            type: String,
            require: true,
            max: 50,
            unique: true
        },
        senha: {
            type: String,
            require: true,
            min: 6,
        },
        foto_perfil: {
            type: String,
            default: "",
        },
        foto_fundo: {
            type: String,
            default: "",
        },
        seguidores: {
            type: Array,
            default: [],
        },
        seguindo: {
            type: Array,
            default: [],
        },
        e_admin: {
            type: Boolean,
            default: false,
        },
        descricao: {
            type: String,
            max: 50
        },
        cidade_atual: {
            type: String,
            max: 50
        },
        cidade_natal: {
            type: String,
            max: 50
        },
        relacionamento: {
            type: Number,
            enum: [1, 2, 3]
        }
    },
    {timestamps: true}
)


module.exports = mongoose.model(
    "Usuario",
    UsuarioSchema,
    "usuarios"
);
