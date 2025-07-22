function getById(id: string) {
    return document.getElementById(id);
}

const apiUrl = 'http://localhost:3000/socialifpi'
const apiUrl_posts = 'http://localhost:3000/socialifpi/postagem'

interface Postagem {
    id: number;
    titulo: string;
    conteudo: string;
    data: string;
    curtidas: number;
}

interface Comentario {
    id: number;
    id_post: number;
    conteudo: string;
    data: string;
}

// Função para listar todas as postagens
async function listarPostagens() {
    const response = await fetch(apiUrl_posts);
    const postagens: Postagem[] = await response.json();

    const postagensElement = getById('postagens');
    if (postagensElement) {
        postagensElement.innerHTML = '';
        for (const postagem of postagens) {
            const article = document.createElement('article');

            const titulo = document.createElement('h2');
            titulo.textContent = postagem.titulo;

            const conteudo = document.createElement('p');
            conteudo.textContent = postagem.conteudo;

            const data = document.createElement('p');
            data.className = 'data';
            data.textContent = new Date(postagem.data).toLocaleDateString();

            const curtidas = document.createElement('p');
            curtidas.textContent = `Curtidas: ${postagem.curtidas}`;
            curtidas.style.fontWeight = 'bold';

            const botaoCurtir = document.createElement('button');
            botaoCurtir.textContent = 'Curtir';
            //botaoCurtir.addEventListener('click', () => curtirPostagem(postagem.id, curtidas));
            botaoCurtir.addEventListener('click', async (e) => {
                e.preventDefault(); // <-- evita reload
                e.stopPropagation(); // <-- evita propagação extra (se necessário)
                curtirPostagem(postagem.id, curtidas);
            });
        

            const divComentarios = document.createElement('div');
            divComentarios.className = 'comentarios';
            divComentarios.id = `comentarios-${postagem.id}`;

            // Botão para mostrar comentários
            const botaoMostrarComentarios = document.createElement('button');
            botaoMostrarComentarios.textContent = 'Mostrar comentários';
            botaoMostrarComentarios.addEventListener('click', () =>
                mostrarComentarios(postagem.id, divComentarios, botaoMostrarComentarios)
            );

            // Botão comentar
            const botaoComentar = document.createElement('button');
            botaoComentar.textContent = 'Comentar';
            botaoComentar.addEventListener('click', () =>
                mostrarCampoComentario(postagem.id, article, botaoComentar)
            );


            // Botão de opções
            const botaoOpcoes = document.createElement('button');
            botaoOpcoes.textContent = '⋮';
            botaoOpcoes.className = 'botao-opcoes';

            // Menu de opções oculto
            const menuOpcoes = document.createElement('div');
            menuOpcoes.className = 'menu-opcoes';
            menuOpcoes.style.display = 'none'; // Oculto por padrão

            // Opções no menu
            const opcaoExcluir = document.createElement('button');
            opcaoExcluir.textContent = 'Excluir';
            opcaoExcluir.addEventListener('click', () => {
            excluirPostagem(postagem.id);
            });

            const opcaoEditar = document.createElement('button');
            opcaoEditar.textContent = 'Editar';
            opcaoEditar.addEventListener('click', () => {
            editarPostagem(postagem);
            });

            const opcaoOcultarComentarios = document.createElement('button');
            opcaoOcultarComentarios.textContent = 'Ocultar Comentários';
            opcaoOcultarComentarios.addEventListener('click', () => {
            const comentariosDiv = getById(`comentarios-${postagem.id}`);
            if (comentariosDiv) {
            comentariosDiv.style.display = comentariosDiv.style.display === 'none' ? 'block' : 'none';
            }
            });

            menuOpcoes.appendChild(opcaoEditar);
            menuOpcoes.appendChild(opcaoExcluir);
            menuOpcoes.appendChild(opcaoOcultarComentarios);

            // Mostrar/ocultar menu ao clicar no botão de opções
            botaoOpcoes.addEventListener('click', () => {
            menuOpcoes.style.display = menuOpcoes.style.display === 'none' ? 'block' : 'none';
            });

            article.appendChild(botaoOpcoes);
            article.appendChild(menuOpcoes);



            article.appendChild(titulo);
            article.appendChild(conteudo);
            article.appendChild(data);
            article.appendChild(curtidas);
            article.appendChild(botaoCurtir);
            article.appendChild(botaoComentar);
            article.appendChild(botaoMostrarComentarios);
            article.appendChild(divComentarios);

            postagensElement.appendChild(article);

            atualizarContadorComentarios(postagem.id, botaoMostrarComentarios);
        }
    }
}

// Curtir
async function curtirPostagem(id: number, curtidasElement: HTMLParagraphElement) {
    const response = await fetch(`${apiUrl_posts}/${id}/curtir`, { method: 'POST' });
    const result = await response.json();
    curtidasElement.textContent = `Curtidas: ${result.curtidas}`;
}

// Incluir nova postagem
async function incluirPostagem() {
    const tituloInput = <HTMLInputElement>getById('titulo');
    const conteudoInput = <HTMLInputElement>getById('conteudo');

    if (tituloInput && conteudoInput) {
        const novaPostagem = {
            titulo: tituloInput.value,
            conteudo: conteudoInput.value,
            data: new Date().toISOString(),
            curtidas: 0
        };

        await fetch(apiUrl_posts, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaPostagem)
        });

        listarPostagens();
        tituloInput.value = '';
        conteudoInput.value = '';
    }
}

//Excluir postagem
async function excluirPostagem(id: number) {
    const confirmacao = confirm('Deseja excluir esta postagem?');
    if (confirmacao) {
        await fetch(`${apiUrl_posts}/${id}`, { method: 'DELETE' });
        listarPostagens();
    }
}

//Editar Postagem
async function editarPostagem(postagem: Postagem) {
    const novoTitulo = prompt('Novo título:', postagem.titulo);
    const novoConteudo = prompt('Novo conteúdo:', postagem.conteudo);

    if (novoTitulo !== null && novoConteudo !== null) {
        const atualizada = {
            ...postagem,
            titulo: novoTitulo,
            conteudo: novoConteudo
        };

        await fetch(`${apiUrl_posts}/${postagem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(atualizada)
        });

        listarPostagens();
    }
}


// Mostra campo de input para comentar
function mostrarCampoComentario(idPost: number, container: HTMLElement, botaoComentar: HTMLButtonElement) {
    const existingInput = container.querySelector(`#comentario-input-${idPost}`);
    const existingBotao = container.querySelector(`#botao-enviar-${idPost}`);

    if (existingInput && existingBotao) {
        // Se já existe, remover tudo (cancelar comentário)
        existingInput.remove();
        existingBotao.remove();
        botaoComentar.textContent = 'Comentar';
        return;
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Digite seu comentário...';
    input.id = `comentario-input-${idPost}`;

    const botaoEnviar = document.createElement('button');
    botaoEnviar.textContent = 'Enviar';
    botaoEnviar.id = `botao-enviar-${idPost}`;

    botaoEnviar.addEventListener('click', async () => {
        if (input.value.trim() !== '') {
            const novoComentario = {
                id_post: idPost,
                conteudo: input.value,
                data: new Date().toISOString()
            };

            await fetch(`${apiUrl_posts}/${idPost}/comentario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoComentario)
            });

            atualizarContadorComentarios(idPost, botaoComentar.nextElementSibling as HTMLButtonElement);
            input.remove();
            botaoEnviar.remove();
            botaoComentar.textContent = 'Comentar';
        }
    });

    container.appendChild(input);
    container.appendChild(botaoEnviar);
    botaoComentar.textContent = 'Cancelar comentário';
}

// Mostrar comentários com botões de curtir e excluir
async function mostrarComentarios(idPost: number, container: HTMLElement, botao: HTMLButtonElement) {
    const jaVisivel = container.hasChildNodes();

    if (jaVisivel) {
        container.innerHTML = '';
        botao.textContent = 'Mostrar comentários';
    } else {
        const response = await fetch(`${apiUrl_posts}/${idPost}/comentario`);
        const comentarios: (Comentario & { curtidas?: number })[] = await response.json();

        container.innerHTML = '';

        comentarios.forEach(comentario => {
            const comentarioContainer = document.createElement('div');
            comentarioContainer.className = 'comentario-item';

            const texto = document.createElement('p');
            texto.textContent = `${new Date(comentario.data).toLocaleDateString()}: ${comentario.conteudo}`;

            const acoes = document.createElement('div');
            acoes.className = 'comentario-acoes';

            // Curtidas
            const curtidasSpan = document.createElement('span');
            curtidasSpan.textContent = `❤️ ${comentario.curtidas ?? 0}`;

            const botaoCurtir = document.createElement('button');
            botaoCurtir.innerHTML = '❤️';
            botaoCurtir.title = 'Curtir comentário';
            botaoCurtir.addEventListener('click', async () => {
                const resp = await fetch(`${apiUrl_posts}/comentario/${comentario.id}/curtir`, {
                    method: 'POST'
                });
                const result = await resp.json();
                curtidasSpan.textContent = `❤️ ${result.curtida_comentarios}`;
            });

            // Excluir 
            const botaoExcluir = document.createElement('button');
            botaoExcluir.innerHTML = '🗑️';
            botaoExcluir.title = 'Excluir comentário';
            botaoExcluir.addEventListener('click', async () => {
                const confirmar = confirm('Deseja excluir este comentário?');
                if (confirmar) {
                    await fetch(`${apiUrl_posts}/comentario/${comentario.id}/excluir`, {
                        method: 'DELETE'
                    });
                    mostrarComentarios(idPost, container, botao);
                    atualizarContadorComentarios(idPost, botao);
                }
            });

            acoes.appendChild(curtidasSpan);
            acoes.appendChild(botaoCurtir);
            acoes.appendChild(botaoExcluir);

            comentarioContainer.appendChild(texto);
            comentarioContainer.appendChild(acoes);
            container.appendChild(comentarioContainer);
        });

        botao.textContent = `Ocultar comentários (${comentarios.length})`;
    }
}




// Curtir
async function mostrar_comentario(id: number, curtidasElement: HTMLParagraphElement) {
    const response = await fetch(`${apiUrl_posts}/${id}/curtir`, { method: 'POST' });
    const result = await response.json();
    curtidasElement.textContent = `Curtidas: ${result.curtidas}`;
}


// Atualiza botão com quantidade de comentários
async function atualizarContadorComentarios(idPost: number, botao: HTMLButtonElement) {
    const response = await fetch(`${apiUrl_posts}/${idPost}/comentario`);
    const comentarios: Comentario[] = await response.json();
    botao.textContent = `Mostrar ${comentarios.length} comentário(s)`;
}

// Inicializa
listarPostagens();

const botaoNovaPostagem = getById("botaoNovaPostagem");

if (botaoNovaPostagem) {
    botaoNovaPostagem.addEventListener('click', (event) => {
        event.preventDefault();
        incluirPostagem();
    });
}