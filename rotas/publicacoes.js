const router = require('express').Router();

const Publicacao = require('../modelos/Publicacao')

// criar uma publicação
router.post('/', async (pedido, resposta) => {
    const novaPublicacao = new Publicacao(pedido.body)

    try {

        const PublicacaoCriada = await novaPublicacao.save()

        resposta.status(200).json(PublicacaoCriada)

    } catch (erro) {
        resposta.status(500).json(erro)
    }
})


// atualizar uma publicação
router.put("/:id", async (pedido, resposta) => {
    
    try {

        const publicacao = await Publicacao.findById(pedido.params.id)

        if (publicacao.usuario_id === pedido.body.usuario_id) {

            await publicacao.updateOne({$set: pedido.body})

            resposta.status(200).json("A publicação foi atualizada")

        } else {
            resposta.status(403).json("Você só pode atualizar suas publicações.")
        }
    } catch (erro) {
        resposta.status(500).json(erro)
    }
   
})


// apagar uma publicação
router.delete("/:id", async (pedido, resposta) => {
    
    try {

        const publicacao = await Publicacao.findById(pedido.params.id)

        if (publicacao.usuario_id === pedido.body.usuario_id) {

            await publicacao.deleteOne()

            resposta.status(200).json("A publicação foi apagada")

        } else {
            resposta.status(403).json("Você só pode apagar suas publicações.")
        }
    } catch (erro) {
        resposta.status(500).json(erro)
    }
   
})


// curtir uma publicação
router.put("/:id/curtir", async (pedido, resposta) => {

    try {

        const publicacao = await Publicacao.findById(pedido.params.id)

        if (!publicacao.likes.includes(pedido.body.usuario_id)) {
            await publicacao.updateOne({ $push: { likes: pedido.body.usuario_id } })

            resposta.status(200).json("A publicação foi curtida")
        } else {
            await publicacao.updateOne({ $pull: { likes: pedido.body.usuario_id } });

            resposta.status(200).json("A publicação foi descurtida")
        }
    } catch (erro) {
        resposta.status(500).json(erro);
    }
})


// selecionar uma publicação
router.get('/:id', async (pedido, resposta) => {

    try {

        const publicacao = await Publicacao.findById(pedido.params.id);

        return resposta.status(200).json(publicacao);

    } catch (erro) {
        resposta.status(500).json(erro)
    }
})


// selecionar publicações da linha do tempo
router.get('/linha_do_tempo/todos', async (pedido, resposta) => {


    try {

        const usuario_atual = await Usuario.findById(pedido.body.usuario_id);

        const publicacoesUsuario = await Publicacao.find({usuario_id: usuario_atual._id});

        const publicacoesAmigos = await Promise.all(

            usuario_atual.seguindo.map((amigo_id) => {
                return Publicacao.find({ usuario_id: amigo_id })
            })
        );

        resposta.status(200).json(publicacoesUsuario.concat(...publicacoesAmigos))
    } catch (erro) {
        resposta.status(500).json(erro)
    }
})



module.exports = router;