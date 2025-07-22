"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comentario = void 0;
class Comentario {
    constructor(id, id_post, conteudo, data, curtidas = 0) {
        this.id = id;
        this.id_post = id_post;
        this.conteudo = conteudo;
        this.data = data;
        this.curtidas = curtidas;
    }
    getId() {
        return this.id;
    }
    getId_post() {
        return this.id_post;
    }
    getConteudo() {
        return this.conteudo;
    }
    getData() {
        return this.data;
    }
    curtir() {
        this.curtidas++;
    }
    getCurtidas() {
        return this.curtidas;
    }
}
exports.Comentario = Comentario;
