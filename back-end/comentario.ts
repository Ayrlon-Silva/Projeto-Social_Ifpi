export class Comentario {
    private id: number;
    private id_post: number;
    private conteudo: string;
    private data: Date;
    private curtidas: number;

    constructor(id: number, id_post: number, conteudo: string, data: Date,  curtidas: number = 0) {
        this.id = id;
        this.id_post = id_post;
        this.conteudo = conteudo;
        this.data = data
        this.curtidas = curtidas;
    }

    public getId(): number {
        return this.id;
    }

    public getId_post(): number {
        return this.id_post;
    }

    public getConteudo(): string {
        return this.conteudo;
    }

    public getData(): Date {
        return this.data;
    }

    public curtir(): void {
        this.curtidas++;
    }

    public getCurtidas(): number {
        return this.curtidas;
    }

}