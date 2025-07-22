"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RepositorioDePostagens_1 = require("./RepositorioDePostagens");
const RepositorioDeComentarios_1 = require("./RepositorioDeComentarios");
const Postagem_1 = require("./Postagem");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const repositorio = new RepositorioDePostagens_1.RepositorioDePostagens();
const repositorioComentarios = new RepositorioDeComentarios_1.RepositorioDeComentarios();
// Configurações do Express
app.use(express_1.default.json());
// Configuração básica do CORS
app.use((0, cors_1.default)());
// Povoar o repositório com postagens iniciais
//repositorio.povoar();
// Rotas
const PATH_POSTAGEM = '/socialifpi/postagem';
const PATH_COMENTARIO = '/socialifpi/comentario';
const PATH_POSTAGEM_ID = PATH_POSTAGEM + '/:id';
const PATH_CURTIR = PATH_POSTAGEM_ID + '/curtir';
const PATH_COMENTARIOS = PATH_POSTAGEM_ID + '/comentario'; // Comentários de uma postagem
const PATH_COMENTARIO_ID = PATH_POSTAGEM + '/comentario/:id';
const PATH_CURTIR_COMENTARIO = PATH_COMENTARIO_ID + '/curtir';
const PATH_EXCLUIR_COMENTARIO = PATH_COMENTARIO_ID + '/excluir';
// Listar todas as postagens
app.get(PATH_POSTAGEM, (req, res) => {
    const postagens = repositorio.listar();
    res.json(postagens);
});
// Consultar uma postagem
app.get(PATH_POSTAGEM_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const postagem = repositorio.consultar(id);
    if (!postagem) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }
    res.json(postagem);
});
// Incluir nova postagem
app.post(PATH_POSTAGEM, (req, res) => {
    const { titulo, conteudo, data, curtidas } = req.body;
    const novaPostagem = new Postagem_1.Postagem(0, titulo, conteudo, new Date(data), curtidas || 0);
    const postagemIncluida = repositorio.incluir(novaPostagem);
    res.status(201).json(postagemIncluida);
});
// Alterar postagem
app.put(PATH_POSTAGEM_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, conteudo, data, curtidas } = req.body;
    const sucesso = repositorio.alterar(id, titulo, conteudo, data, curtidas);
    if (!sucesso) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }
    res.status(200).json({ message: 'Postagem alterada com sucesso' });
});
// Excluir postagem
app.delete(PATH_POSTAGEM_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const remover_comentarios = repositorioComentarios.excluirPorPostagem(id);
    const sucesso = repositorio.excluir(id);
    if (!sucesso) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }
    res.status(200).json({ message: 'Postagem excluída com sucesso' });
});
// Curtir postagem
app.post(PATH_CURTIR, (req, res) => {
    const id = parseInt(req.params.id);
    const curtidas = repositorio.curtir(id);
    if (curtidas == null) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }
    res.json({ message: 'Postagem curtida com sucesso', curtidas });
});
// Listar comentários de uma postagem
app.get(PATH_COMENTARIOS, (req, res) => {
    const id_post = parseInt(req.params.id);
    const comentarios = repositorioComentarios.listarPorPostagem(id_post);
    res.json(comentarios);
});
// Incluir novo comentário em uma postagem
app.post(PATH_COMENTARIOS, (req, res) => {
    const id_post = parseInt(req.params.id);
    const { conteudo } = req.body;
    // Verifica se a postagem existe
    const postagem = repositorio.consultar(id_post);
    if (!postagem) {
        res.status(404).json({ message: 'Postagem não encontrada para comentar' });
        return;
    }
    const novoComentario = repositorioComentarios.incluir(id_post, conteudo);
    res.status(201).json(novoComentario);
});
// Consultar um comentário pelo ID
app.get(PATH_COMENTARIO_ID, (req, res) => {
    const id = parseInt(req.params.id);
    const comentario = repositorioComentarios.consultar(id);
    if (!comentario) {
        res.status(404).json({ message: 'Comentário não encontrado' });
        return;
    }
    res.json(comentario);
});
// Curtir um comentário pelo ID
app.post(PATH_CURTIR_COMENTARIO, (req, res) => {
    const id = parseInt(req.params.id);
    const curtida_comentarios = repositorioComentarios.curtirPorId(id);
    if (curtida_comentarios == null) {
        res.status(404).json({ message: 'Comentario não encontrado' });
        return;
    }
    res.json({ message: 'comentario curtido com sucesso', curtida_comentarios });
});
//excluir comentario
app.delete(PATH_EXCLUIR_COMENTARIO, (req, res) => {
    const id = parseInt(req.params.id);
    const sucesso = repositorioComentarios.excluirPorId(id);
    if (!sucesso) {
        res.status(404).json({ message: 'comentario não encontrado' });
        return;
    }
    res.status(200).json({ message: 'comentario excluído com sucesso' });
});
// Fallback para rotas inexistentes
app.use((req, res, next) => {
    res.status(404).send('Não encontrado');
});
// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
