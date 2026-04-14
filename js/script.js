/**
 * @author Cauã Ferreira <dev.cauaferreira@gmail.com>
 * @since 2026-04-12
 * @version 1.2.0
 * @description
 * CineFlix - Aplicação web para busca, listagem e recomendação de filmes
 * utilizando a API do The Movie Database (TMDB).
 *
 * Funcionalidades:
 * - Listagem de filmes populares
 * - Busca por nome
 * - Sistema de favoritos (LocalStorage)
 * - Sugestão aleatória de filmes ("Me Surpreenda")
 */

/**
 * Sugere um filme aleatório a partir da API do TMDB.
 * Utiliza paginação aleatória para aumentar a variedade.
 *
 * @async
 * @function sugerirFilme
 * @returns {Promise<void>}
 */
async function sugerirFilme() {
  try {
    const container = document.getElementById("resultados");

    // loading simples
    container.innerHTML = "<p style='width:100%; text-align:center;'>🎲 Buscando um filme...</p>";

    // página aleatória
    const pagina = Math.floor(Math.random() * 50) + 1;

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=3917a2abf09e67cd67037559f92a346d&language=pt-BR&page=${pagina}`;

    const resp = await fetch(url);
    const data = await resp.json();

    const filmes = data.results;

    const aleatorio = filmes[Math.floor(Math.random() * filmes.length)];

    mostrarFilmes([aleatorio]);

  } catch (erro) {
    console.error("Erro ao sugerir filme:", erro);
  }
}

/**
 * Renderiza uma lista de filmes no DOM.
 *
 * @function mostrarFilmes
 * @param {Array<Object>} filmes - Lista de filmes retornados pela API
 * @returns {void}
 */
function mostrarFilmes(filmes) {
  const container = document.getElementById("resultados");

  container.innerHTML = filmes.map(f => {

    let img = f.poster_path
      ? "https://image.tmdb.org/t/p/w500" + f.poster_path
      : "https://via.placeholder.com/200x300?text=Sem+Imagem";

    const nota = f.vote_average.toFixed(1);

    return `
      <div class="card">
        <img src="${img}" alt="${f.title}">
        <h3>${f.title}</h3>
        <p>${gerarEstrelas(f.vote_average)} (${nota})</p>
        <p>Data: ${f.release_date}</p>
        <button onclick='adicionarFavorito(${JSON.stringify(f)})'>
          ❤️ Favoritar
        </button>
      </div>
    `;
  }).join("");
}

/**
 * @author Cauã Ferreira <dev.cauaferreira@gmail.com>
 * @since 2026-04-02
 * @version 1.1.0
 * @description
 * Busca os filmes populares na API do TMDB e renderiza na tela.
 *
 * @function adicionarFavorito
 * @param {Object} filme - Objeto do filme
 * @returns {void}
 */
function adicionarFavorito(filme) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  const filmeExistente = favoritos.some(f => f.id === filme.id);

  if (filmeExistente) {
    Swal.fire({
      title: "ERRO!",
      text: `O filme ${filme.title} já foi adicionado`,
      icon: "error",
      timer: 2000
    });
  } else {
    favoritos.push(filme);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));

    Swal.fire({
      title: "Filme favoritado",
      text: `O filme ${filme.title} foi favoritado com sucesso`,
      icon: "success",
      timer: 2000
    });
  }
}

/**
 * @author Cauã Ferreira <dev.cauaferreira@gmail.com>
 * @since 2026-04-02
 * @version 1.1.0
 * @description
 * Carrega filmes populares da API do TMDB e renderiza no DOM.
 *
 * @async
 * @function carregarFilmesPopulares
 * @returns {Promise<void>}
 */
async function carregarFilmesPopulares() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=3917a2abf09e67cd67037559f92a346d&language=pt-BR`
    );

    const data = await response.json();

    const container = document.getElementById("resultados");

    mostrarFilmes(data.results);

  } catch (erro) {
    console.error("Erro ao carregar filmes populares:", erro);
  }
}

carregarFilmesPopulares();

/**
 * @author Cauã Ferreira <dev.cauaferreira@gmail.com>
 * @since 2026-03-28
 * @version 1.1.0
 * @description
 * Busca filmes pelo nome digitado e renderiza os resultados.
 *
 * @function buscaFilme
 * @param {Event} event - Evento de submit
 * @returns {void}
 */
function buscaFilme(event) {
  event.preventDefault();

  const filme = document.getElementById("filme").value;

  if (filme.trim() === "") {
    alert("Digite um filme!");
    return;
  }

  const generos = {
    28: "Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    18: "Drama",
    10751: "Família",
    14: "Fantasia",
    27: "Terror",
    10749: "Romance",
    878: "Ficção"
  };

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=3917a2abf09e67cd67037559f92a346d&query=${filme}&language=pt-BR`)
    .then(res => res.json())
    .then(res => {

      const container = document.getElementById("resultados");

      container.innerHTML = res.results.map(f => {

        let img;

        if (f.poster_path) {
          img = "https://image.tmdb.org/t/p/w500" + f.poster_path;
        } else {
          img = "https://via.placeholder.com/200x300?text=Sem+Imagem";
        }

        const nomesGeneros = f.genre_ids
          .map(id => generos[id])
          .join(", ");

        const notaFormatada = f.vote_average.toFixed(1);

        return `
          <div class="card">
            <img src="${img}" alt="${f.title}">
            <h3>${f.title}</h3>
            <p>${gerarEstrelas(f.vote_average)} (${notaFormatada})</p>
            <p>Data: ${f.release_date}</p>
            <p>Gênero: ${nomesGeneros}</p>
            <button onclick='adicionarFavorito(${JSON.stringify(f)})'>
              ❤️ Favoritar
            </button>
          </div>
        `;
      }).join("");

    })
    .catch(err => console.error(err));
}

/**
 * Converte nota (0 a 10) para estrelas (0 a 5).
 *
 * @function gerarEstrelas
 * @param {number} nota - Nota do filme
 * @returns {string}
 */
function gerarEstrelas(nota) {
  if (!nota) return "☆☆☆☆☆";

  const estrelas = Math.round(nota / 2);
  let resultado = "";

  for (let i = 1; i <= 5; i++) {
    resultado += i <= estrelas ? "⭐" : "☆";
  }

  return resultado;
}