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
exports.RepositorioDeComentarios = void 0;
const comentario_1 = require("./comentario");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class RepositorioDeComentarios {
    constructor() {
        this.comentarios = [];
        this.nextId = 1;
        this.filePath = path.join(__dirname, 'dados', 'comentarios.json');
        this.carregar();
    }
    carregar() {
        try {
            if (fs.existsSync(this.filePath)) {
                const dados = fs.readFileSync(this.filePath, 'utf-8');
                const comentariosJson = JSON.parse(dados);
                this.comentarios = comentariosJson.map((c) => new comentario_1.Comentario(c.id, c.id_post, c.conteudo, new Date(c.data)));
                this.nextId = this.comentarios.reduce((max, c) => Math.max(max, c.getId()), 0) + 1;
            }
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Erro ao carregar comentários:", err.message);
            }
            else {
                console.error("Erro ao carregar comentários:", err);
            }
            this.comentarios = [];
            this.nextId = 1;
        }
    }
    salvar() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.comentarios, null, 2));
    }
    incluir(id_post, conteudo) {
        const novoComentario = new comentario_1.Comentario(this.nextId++, id_post, conteudo, new Date());
        this.comentarios.push(novoComentario);
        this.salvar();
        return novoComentario;
    }
    curtirPorId(id) {
        const comentario = this.consultar(id);
        if (comentario) {
            comentario['curtidas'] = comentario.getCurtidas() + 1;
            this.salvar();
            return comentario.getCurtidas();
        }
        return null;
    }
    consultar(id) {
        const comentario = this.comentarios.find(c => c.getId() === id);
        return comentario;
    }
    listarPorPostagem(id_post) {
        return this.comentarios
            .filter(c => c.getId_post() === id_post)
            .sort((a, b) => b.getData().getTime() - a.getData().getTime());
    }
    excluirPorId(id) {
        const tamanhoAntes = this.comentarios.length;
        this.comentarios = this.comentarios.filter(comentario => comentario.getId() !== id);
        const foiExcluido = this.comentarios.length < tamanhoAntes;
        if (foiExcluido) {
            this.salvar();
        }
        return foiExcluido;
    }
    excluirPorPostagem(idPostagem) {
        let removidos = 0;
        for (let i = this.comentarios.length - 1; i >= 0; i--) {
            const c = this.comentarios[i];
            if (c.getId_post() === idPostagem) {
                this.comentarios.splice(i, 1);
                removidos++;
            }
        }
        if (removidos > 0) {
            this.salvar();
        }
        return removidos;
    }
    remover(id) {
        const index = this.comentarios.findIndex(c => c.getId() === id);
        if (index === -1)
            return false;
        this.comentarios.splice(index, 1);
        this.salvar();
        return true;
    }
    removerPorPostagem(idPostagem) {
        this.comentarios = this.comentarios.filter(c => c.getId_post() !== idPostagem);
        this.salvar();
    }
}
exports.RepositorioDeComentarios = RepositorioDeComentarios;
