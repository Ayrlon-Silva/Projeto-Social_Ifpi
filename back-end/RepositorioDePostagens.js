"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioDePostagens = void 0;
const Postagem_1 = require("./Postagem");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class RepositorioDePostagens {
    constructor() {
        this.postagens = [];
        this.nextId = 1;
        this.filePath = path.join(__dirname, 'dados', 'postagens.json');
        this.carregar();
    }
    carregar() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            if (data.trim()) {
                const jsonData = JSON.parse(data);
                this.postagens = jsonData.map((obj) => new Postagem_1.Postagem(obj.id, obj.titulo, obj.conteudo, new Date(obj.data), obj.curtidas));
                this.nextId = this.postagens.reduce((max, p) => Math.max(max, p.getId()), 0) + 1;
            }
        }
        catch (err) {
            if (err instanceof Error) {
                console.error('Erro ao carregar postagens:', err.message);
            }
            else {
                console.error('Erro ao carregar postagens:', err);
            }
            this.postagens = [];
            this.nextId = 1;
        }
    }
    salvar() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.postagens, null, 2));
    }
    // Método para incluir uma nova postagem
    incluir(postagem) {
        postagem['id'] = this.nextId++;
        this.postagens.push(postagem);
        this.salvar();
        return postagem;
    }
    // Método para alterar uma postagem existente
    alterar(id, titulo, conteudo, data, curtidas) {
        const postagem = this.consultar(id);
        if (postagem) {
            postagem['titulo'] = titulo;
            postagem['conteudo'] = conteudo;
            postagem['data'] = data;
            postagem['curtidas'] = curtidas;
            this.salvar();
            return true;
        }
        return false;
    }
    // Método para consultar uma postagem pelo ID
    consultar(id) {
        return this.postagens.find(postagem => postagem.getId() == id);
    }
    // Método para excluir uma postagem pelo ID
    excluir(id) {
        const index = this.postagens.findIndex(postagem => postagem.getId() == id);
        if (index != -1) {
            this.postagens.splice(index, 1);
            this.salvar();
            return true;
        }
        return false;
    }
    // Método para curtir uma postagem pelo ID
    curtir(id) {
        const postagem = this.consultar(id);
        if (postagem) {
            postagem['curtidas'] = postagem.getCurtidas() + 1;
            this.salvar();
            return postagem.getCurtidas();
        }
        return null;
    }
    // Método para gerar uma data aleatória dentro de um intervalo de anos
    gerarDataAleatoria(anosPassados = 5) {
        const hoje = new Date();
        const anoInicial = hoje.getFullYear() - anosPassados;
        const anoAleatorio = Math.floor(Math.random() * (hoje.getFullYear() - anoInicial)) + anoInicial;
        const mesAleatorio = Math.floor(Math.random() * 12);
        const diaAleatorio = Math.floor(Math.random() * 28) + 1; // Considerando 28 dias para evitar problemas com fevereiro
        return new Date(anoAleatorio, mesAleatorio, diaAleatorio);
    }
    // Método para listar todas as postagens
    listar() {
        return this.postagens.sort((a, b) => new Date(b.getData()).getTime() - new Date(a.getData()).getTime());
    }
}
exports.RepositorioDePostagens = RepositorioDePostagens;
