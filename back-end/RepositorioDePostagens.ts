import { Postagem } from './Postagem';
import * as path from 'path';
import * as fs from 'fs'

export class RepositorioDePostagens {
    private postagens: Postagem[] = [];
    private nextId: number = 1;
    private filePath = path.join(__dirname, 'dados', 'postagens.json');

    constructor() {
        this.carregar();
    }

    private carregar(): void {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            if (data.trim()) {
                const jsonData = JSON.parse(data);
                this.postagens = jsonData.map((obj: any) =>
                    new Postagem(obj.id, obj.titulo, obj.conteudo, new Date(obj.data), obj.curtidas)
                );
                this.nextId = this.postagens.reduce((max, p) => Math.max(max, p.getId()), 0) + 1;
            }
        } catch (err) {
        if (err instanceof Error) {
            console.error('Erro ao carregar postagens:', err.message);
        } else {
            console.error('Erro ao carregar postagens:', err);
        }
            this.postagens = [];
            this.nextId = 1;
        }
    }

    private salvar(): void {
        fs.writeFileSync(this.filePath, JSON.stringify(this.postagens, null, 2));
    }


    // Método para incluir uma nova postagem
    public incluir(postagem: Postagem): Postagem {
        postagem['id'] = this.nextId++;
        this.postagens.push(postagem);
        this.salvar();
        return postagem;
    }

    // Método para alterar uma postagem existente
    public alterar(id: number, titulo: string, conteudo: string, data: Date, curtidas: number) : boolean {
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
    public consultar(id: number): Postagem | undefined {
        return this.postagens.find(postagem => postagem.getId() == id);
    }

    // Método para excluir uma postagem pelo ID
    public excluir(id: number): boolean {
        const index = this.postagens.findIndex(postagem => postagem.getId() == id);
        if (index != -1) {
            this.postagens.splice(index, 1);
            this.salvar();
            return true;
        }
        return false;
    }

    // Método para curtir uma postagem pelo ID
    public curtir(id: number): number | null {
        const postagem = this.consultar(id);
        if (postagem) {
            postagem['curtidas'] = postagem.getCurtidas() + 1;
            this.salvar();
            return postagem.getCurtidas();
        }
        return null;
    }

    // Método para gerar uma data aleatória dentro de um intervalo de anos
    private gerarDataAleatoria(anosPassados: number = 5): Date {
        const hoje = new Date();
        const anoInicial = hoje.getFullYear() - anosPassados;
        const anoAleatorio = Math.floor(Math.random() * (hoje.getFullYear() - anoInicial)) + anoInicial;
        const mesAleatorio = Math.floor(Math.random() * 12);
        const diaAleatorio = Math.floor(Math.random() * 28) + 1; // Considerando 28 dias para evitar problemas com fevereiro
        return new Date(anoAleatorio, mesAleatorio, diaAleatorio);
    }

    // Método para listar todas as postagens
    public listar(): Postagem[] {
        return this.postagens.sort((a, b) => new Date(b.getData()).getTime() - new Date(a.getData()).getTime());
    }
}