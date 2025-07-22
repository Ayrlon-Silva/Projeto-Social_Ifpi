import { Comentario } from "./comentario";
import * as fs from 'fs';
import * as path from 'path';


export class RepositorioDeComentarios {
    private comentarios: Comentario[] = [];
    private nextId: number = 1;

    private filePath = path.join(__dirname, 'dados', 'comentarios.json');

    constructor() {
        this.carregar();
    }

    private carregar() {
    try {
        if (fs.existsSync(this.filePath)) {
            const dados = fs.readFileSync(this.filePath, 'utf-8');
            const comentariosJson = JSON.parse(dados);
            this.comentarios = comentariosJson.map((c: any) =>
                new Comentario(c.id, c.id_post, c.conteudo, new Date(c.data))
            );
            this.nextId = this.comentarios.reduce((max, c) => Math.max(max, c.getId()), 0) + 1;
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error("Erro ao carregar comentários:", err.message);
        } else {
            console.error("Erro ao carregar comentários:", err);
        }
        this.comentarios = [];
        this.nextId = 1;
    }
}

    public salvar(): void {
        fs.writeFileSync(this.filePath, JSON.stringify(this.comentarios, null, 2));
    }

    public incluir(id_post: number, conteudo: string): Comentario {
        const novoComentario = new Comentario(this.nextId++, id_post, conteudo, new Date());
        this.comentarios.push(novoComentario);
        this.salvar();
        return novoComentario;
    }

    public curtirPorId(id: number): number | null{
        const comentario = this.consultar(id);
        if (comentario) {
            comentario['curtidas'] = comentario.getCurtidas() + 1;
            this.salvar();
            return comentario.getCurtidas();
        }
        return null;
    }

    public consultar(id: number): Comentario | undefined {
        const comentario = this.comentarios.find(c => c.getId() === id);
        return comentario
    }

    public listarPorPostagem(id_post: number): Comentario[] {
        return this.comentarios
            .filter(c => c.getId_post() === id_post)
            .sort((a, b) => b.getData().getTime() - a.getData().getTime());
    }

    excluirPorId(id: number): boolean {
        const tamanhoAntes = this.comentarios.length;

        this.comentarios = this.comentarios.filter(comentario => comentario.getId() !== id);

        const foiExcluido = this.comentarios.length < tamanhoAntes;
        if (foiExcluido) {
        this.salvar();
        }

        return foiExcluido;
    }

    public excluirPorPostagem(idPostagem: number): number { //Exclui todos os comentarios de uma postagem
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

    public remover(id: number): boolean {
    const index = this.comentarios.findIndex(c => c.getId() === id);
    if (index === -1) return false;

    this.comentarios.splice(index, 1);
    this.salvar();
    return true;
}

    public removerPorPostagem(idPostagem: number): void {
    this.comentarios = this.comentarios.filter(c => c.getId_post() !== idPostagem);
    this.salvar();
}


}
