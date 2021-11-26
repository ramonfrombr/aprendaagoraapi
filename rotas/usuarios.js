const Usuario = require("../modelos/Usuario");

const bcrypt = require("bcrypt");

const router = require("express").Router();

router.get('/', (pedido, resposta) => {
    resposta.send("Rota do usuario");
})


// selecionar usuario
router.get("/:id", async (pedido, resposta) => {

    try {

        const usuario = await Usuario.findById(pedido.params.id);

        // desconstroi o usuário para remover senha e updatedAt da resposta
        const {senha, updatedAt, ...outros} = usuario._doc

        return resposta.status(200).json(outros);
    } catch (erro) {
        resposta.status(500).json(erro);
    }
})



// atualizar um usuario
router.put("/:id", async (pedido, resposta) => {

    // Se o id no corpo do pedido for igual ao id do url ou se o usuário for admin
    if(pedido.body.usuario_id == pedido.params.id || pedido.body.e_admin) {

        // Se o usuário tentar atualizar a sua senha
        if(pedido.body.senha) {
            try {
                const salt = await bcrypt.genSalt(10);

                pedido.body.senha = await bcrypt.hash(pedido.body.senha, salt);
            } catch (erro) {
                return resposta.status(500).json(erro);
            }
        }

        try {
            const usuario = await Usuario.findByIdAndUpdate(pedido.params.id, {
                $set: pedido.body
            });

            resposta.status(200).json("A conta foi atualizada.");
        } catch (erro) {
            resposta.status(500).json(erro)
        }


    } else {
        return resposta.status(403).json("Você só pode atualizar sua própria conta.")
    }
})



// deletar usuario

router.delete("/:id", async (pedido, resposta) => {

    // Se o id no corpo do pedido for igual ao id do url ou se o usuário for admin
    if(pedido.body.usuario_id == pedido.params.id || pedido.body.e_admin) {


        try {
            const usuario = await Usuario.findByIdAndDelete(pedido.params.id);

            resposta.status(200).json("A conta foi apagada.");
        } catch (erro) {
            resposta.status(500).json(erro);
        }


    } else {
        return resposta.status(403).json("Você só pode apagar sua própria conta.");
    }
})



// seguir usuario
router.put("/:id/seguir", async (pedido, resposta) => {
    
    // Se não for o mesmo usuário
    if(pedido.body.usuario_id !== pedido.params.id) {

        try {

            // Seleciona o usuário a ser seguido
            const usuario = await Usuario.findById(pedido.params.id);

            // Seleciona o usuário conectado
            const usuario_atual = await Usuario.findById(pedido.body.usuario_id);

            // Se a lista de seguidores do usuário a ser seguido não possui o id do usuário conectado
            if (!usuario.seguidores.includes(pedido.body.usuario_id))
            {
                // Atualiza a lista de seguidores do usuário seguido
                await usuario.updateOne({$push: {seguidores: pedido.body.usuario_id}});

                // Atualiza a lista seguindo do usuário conectado
                await usuario_atual.updateOne({$push: {seguindo: pedido.params.id}});

                resposta.status(200).json("O usuário foi seguido.");
            } else {
                resposta.status(403).json("Você já segue este usuário.");
            }


        } catch (erro) {
            resposta.status(500).json(erro);
        }
    }
    // Se for o mesmo usuário
    else {
        resposta.status(403).json("Você não pode seguir a si mesmo");
    }
})

// não seguir usuario
router.put("/:id/nao_seguir", async (pedido, resposta) => {
    
    // Se não for o mesmo usuário
    if(pedido.body.usuario_id !== pedido.params.id) {

        try {

            // Seleciona o usuário a deixar de ser seguido
            const usuario = await Usuario.findById(pedido.params.id);

            // Seleciona o usuário conectado
            const usuario_atual = await Usuario.findById(pedido.body.usuario_id);

            // Se a lista de seguidores do usuário a ser seguido possui o id do usuário conectado
            if (usuario.seguidores.includes(pedido.body.usuario_id))
            {
                // Atualiza a lista de seguidores do usuário seguido
                await usuario.updateOne({$pull: {seguidores: pedido.body.usuario_id}});

                // Atualiza a lista seguindo do usuário conectado
                await usuario_atual.updateOne({$pull: {seguindo: pedido.params.id}});

                resposta.status(200).json("Você deixou de seguir o usuário.");
            } else {
                resposta.status(403).json("Você já deixou de seguir este usuário.");
            }


        } catch (erro) {
            resposta.status(500).json(erro);
        }
    }
    // Se for o mesmo usuário
    else {
        resposta.status(403).json("Você não pode deixar de seguir a si mesmo");
    }
})


// desativar usuario


// parar de seguir usuario

module.exports = router