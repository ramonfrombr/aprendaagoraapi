const router = require("express").Router();

const Usuario = require("../modelos/Usuario");

const bcrypt = require("bcrypt");


// Registrar
router.post("/registrar", async (pedido, resposta) => {

    try {
        // Hash a senha
        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(pedido.body.senha, salt);

        // Cria novo usuario
        const novoUsuario = new Usuario({
            nome_usuario: pedido.body.nome_usuario,
            email: pedido.body.email,
            senha: senha_hash,
        });

        // Salva usuário e responde
        const usuario = await novoUsuario.save();
        resposta.status(200).json(usuario);

    } catch (erro) {
        resposta.status(500).json(erro);
    }
});

// Entrar
router.post("/entrar", async (pedido, resposta) => {

    try {

        const usuario = await Usuario.findOne({email:pedido.body.email});

        !usuario && resposta.status(404).json("usuario nao encontrado");

        const senha_valida = await bcrypt.compare(pedido.body.senha, usuario.senha);

        !senha_valida && resposta.status(400).json("senha incorreta");

        resposta.status(200).json(usuario);
        
    } catch (erro) {
        resposta.status(500).json(erro);
    }
})


module.exports = router;