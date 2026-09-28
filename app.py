import os
import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

ARQUIVO_JSON = 'filmes.json'

def carregar_filmes():
    if not os.path.exists(ARQUIVO_JSON):
        return []
    with open(ARQUIVO_JSON, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def salvar_filmes(filmes):
    with open(ARQUIVO_JSON, 'w', encoding='utf-8') as f:
        json.dump(filmes, f, indent=4, ensure_ascii=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/filmes', methods=['GET'])
def listar_filmes():
    filmes = carregar_filmes()
    return jsonify(filmes), 200

@app.route('/filmes', methods=['POST'])
def adicionar_filme():
    dados = request.get_json()

    # Validação obrigatória
    titulo = dados.get('titulo', '').strip()
    if not titulo:
        return jsonify({'erro': 'O título é obrigatório!'}), 400

    filmes = carregar_filmes()
    novo_id = filmes[-1]['id'] + 1 if filmes else 1

    # Imagem padrão de fallback caso o utilizador não envie link
    poster_padrao = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80"
    poster = dados.get('poster', '').strip() or poster_padrao

    novo_filme = {
        'id': novo_id,
        'titulo': titulo,
        'genero': dados.get('genero', 'Geral').strip(),
        'ano': dados.get('ano', ''),
        'nota': dados.get('nota', ''),
        'poster': poster
    }

    filmes.append(novo_filme)
    salvar_filmes(filmes)
    return jsonify(novo_filme), 201

@app.route('/filmes/<int:id_filme>', methods=['DELETE'])
def deletar_filme(id_filme):
    filmes = carregar_filmes()
    filmes_filtrados = [f for f in filmes if f['id'] != id_filme]

    if len(filmes) == len(filmes_filtrados):
        return jsonify({'erro': 'Filme não encontrado'}), 404

    salvar_filmes(filmes_filtrados)
    return jsonify({'mensagem': 'Removido com sucesso'}), 200

if __name__ == '__main__':
    app.run(debug=True)