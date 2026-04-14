/**
 * @author Cauã Ferreira <dev.cauaferreira@gmail.com>
 * @since 2026-04-12
 * @version 1.2.0
 * @description
 * Gerenciamento de favoritos do CineFlix.
 * Permite remover filmes e renderizar a lista armazenada no LocalStorage.
 */

/**
 * Remove um filme da lista de favoritos com base no ID.
 * Atualiza o LocalStorage e re-renderiza a tela.
 *
 * @function removerFavorito
 * @param {number} id - ID do filme a ser removido
 * @returns {void}
 */
function removerFavorito(id) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    const novaLista = favoritos.filter(f => f.id !== id);

    localStorage.setItem("favoritos", JSON.stringify(novaLista));

    carregarFavoritos(); // atualiza a tela
}

/**
 * Carrega os filmes favoritos do LocalStorage
 * e renderiza dinamicamente no DOM.
 *
 * Caso não haja favoritos, exibe uma mensagem informativa.
 *
 * @function carregarFavoritos
 * @returns {void}
 */
function carregarFavoritos() {    
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const container = document.getElementById("favoritos");
   
    if (favoritos.length === 0) {
        container.innerHTML = "<p class='mensagem-vazia'>Nenhum favorito ainda 😢</p>";
        return;
    }

    container.innerHTML = favoritos.map(fav => {

        let img = fav.poster_path
            ? "https://image.tmdb.org/t/p/w500" + fav.poster_path
            : "https://via.placeholder.com/200x300?text=Sem+Imagem";

        return `
            <div class="card">
                <img src="${img}" alt="${fav.title}">
                <h2>${fav.title}</h2>
                <p>Data: ${fav.release_date}</p>
                <button onclick="removerFavorito(${fav.id})">
                    ❌ Remover
                </button>
            </div>
        `;
    }).join("");
}

/**
 * Inicializa o carregamento dos favoritos ao abrir a página.
 *
 * @function init
 * @returns {void}
 */
carregarFavoritos();