let todosOsFilmes = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarFilmes();

    // Evento de submissão do formulário
    document.getElementById('filmeForm').addEventListener('submit', salvarFilme);

    // Eventos de filtro instantâneo por digitação e seleção
    document.getElementById('filtroNome').addEventListener('input', aplicarFiltros);
    document.getElementById('filtroGenero').addEventListener('change', aplicarFiltros);
});

// GET /filmes
async function carregarFilmes() {
    try {
        const resposta = await fetch('/filmes');
        todosOsFilmes = await resposta.json();
        renderizarFilmes(todosOsFilmes);
    } catch (erro) {
        console.error('Erro ao consultar filmes:', erro);
    }
}

// Filtra no próprio navegador sem precisar recarregar
function aplicarFiltros() {
    const textoBusca = document.getElementById('filtroNome').value.toLowerCase().trim();
    const generoEscolhido = document.getElementById('filtroGenero').value.toLowerCase();

    const filmesFiltrados = todosOsFilmes.filter(filme => {
        const bateNome = filme.titulo.toLowerCase().includes(textoBusca);
        const bateGenero = generoEscolhido === '' || filme.genero.toLowerCase().includes(generoEscolhido);
        return bateNome && bateGenero;
    });

    renderizarFilmes(filmesFiltrados);
}

// Monta os cards dinamicamente
function renderizarFilmes(filmes) {
    const container = document.getElementById('listaFilmes');
    container.innerHTML = '';

    if (filmes.length === 0) {
        container.innerHTML = '<p style="color: #64748b; grid-column: 1 / -1;">Nenhum filme encontrado no catálogo.</p>';
        return;
    }

    filmes.forEach(filme => {
        const card = document.createElement('div');
        card.className = 'card-filme';

        const posterUrl = filme.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';

        card.innerHTML = `
            <img src="${posterUrl}" alt="${filme.titulo}" onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';">
            <div class="card-info">
                <div>
                    <h3 title="${filme.titulo}">${filme.titulo}</h3>
                    <p><strong>Gênero:</strong> ${filme.genero || 'Geral'}</p>
                    <p><strong>Ano:</strong> ${filme.ano || 'N/A'} | <strong>Nota:</strong> ${'⭐'.repeat(filme.nota) || 'N/A'}</p>
                </div>
                <button class="btn-excluir" onclick="excluirFilme(${filme.id})">Remover</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// POST /filmes
async function salvarFilme(evento) {
    evento.preventDefault();

    const tituloInput = document.getElementById('titulo');
    const erroTitulo = document.getElementById('erro-titulo');
    const generoInput = document.getElementById('genero');
    const anoInput = document.getElementById('ano');
    const notaInput = document.getElementById('nota');
    const posterInput = document.getElementById('poster');

    const titulo = tituloInput.value.trim();
    erroTitulo.textContent = '';

    // Validação de campo obrigatório (Exigência do trabalho)
    if (!titulo) {
        erroTitulo.textContent = 'O título do filme é obrigatório.';
        tituloInput.focus();
        return;
    }

    const novoFilme = {
        titulo: titulo,
        genero: generoInput.value,
        ano: anoInput.value ? parseInt(anoInput.value) : '',
        nota: notaInput.value ? parseInt(notaInput.value) : '',
        poster: posterInput.value.trim()
    };

    try {
        const resposta = await fetch('/filmes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoFilme)
        });

        if (resposta.ok) {
            document.getElementById('filmeForm').reset();
            carregarFilmes();
        } else {
            const erro = await resposta.json();
            erroTitulo.textContent = erro.erro || 'Erro ao cadastrar filme.';
        }
    } catch (erro) {
        console.error('Erro de conexão:', erro);
    }
}

// DELETE /filmes/<id>
async function excluirFilme(id) {
    if (!confirm('Deseja remover este filme do catálogo?')) return;

    try {
        const resposta = await fetch(`/filmes/${id}`, { method: 'DELETE' });
        if (resposta.ok) {
            carregarFilmes();
        } else {
            alert('Não foi possível remover o filme.');
        }
    } catch (erro) {
        console.error('Erro ao excluir:', erro);
    }
}