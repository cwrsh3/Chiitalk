function toggleBarra() {
  const barra = document.querySelector('.perfil');
  barra.classList.toggle("hidden");
}

let usuarioLogado = localStorage.getItem("usuariologado");
const admin = "Amanda";

function mostrarLogin() {
  document.getElementById("login-container").style.display = "block";
  document.getElementById("login-overlay").style.display = "block"; // mostra fundo rosa
}

function fecharLogin() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("login-overlay").style.display = "none"; // esconde fundo rosa
}


function logar() {
  const usuario = document.getElementById("usuario").value.trim();
  if (!usuario) {
    alert("Digite um nome de usuário!");
    return;
  }

  usuarioLogado = usuario;
  localStorage.setItem("usuariologado", usuarioLogado);
  alert("Bem-vindo, " + usuarioLogado + "!");
  fecharLogin();
}

document.querySelectorAll(".atividade").forEach(post => {
  const id = post.dataset.id;
  const likeBtn = post.querySelector(".like-btn");
  const likeCount = post.querySelector(".like-count");
  const input = post.querySelector(".comentario-input");
  const comentariosDiv = post.querySelector(".comentarios");

  const savedLikes = localStorage.getItem(id + "_likes");
  const savedComments = JSON.parse(localStorage.getItem(id + "_comentarios")) || [];

  likeCount.textContent = savedLikes || 0;

  savedComments.forEach(c => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${c.nome}:</strong> ${c.texto}`;

    if (usuarioLogado === admin) {
      const btnApagar = document.createElement("button");
      btnApagar.textContent = "X";
      btnApagar.classList.add("apagar");
      btnApagar.onclick = () => {
        comentariosDiv.removeChild(p);
        const index = savedComments.indexOf(c);
        if (index > -1) savedComments.splice(index, 1);
        localStorage.setItem(id + "_comentarios", JSON.stringify(savedComments));
      };
      p.appendChild(btnApagar);
    }

    comentariosDiv.appendChild(p);
  });

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("ativo");
    let likes = parseInt(likeCount.textContent);
    likes = likeBtn.classList.contains("ativo") ? likes + 1 : likes - 1;
    likeCount.textContent = likes;
    localStorage.setItem(id + "_likes", likes);
  });

  input.addEventListener("keypress", e => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      if (!usuarioLogado) {
        alert("Faça login para comentar!");
        return;
      }

      const texto = input.value.trim();
      const comentario = { nome: usuarioLogado, texto };
      savedComments.push(comentario);

      const p = document.createElement("p");
      p.innerHTML = `<strong>${comentario.nome}:</strong> ${comentario.texto}`;

      if (usuarioLogado === admin) {
        const btnApagar = document.createElement("button");
        btnApagar.textContent = "X";
        btnApagar.classList.add("apagar");
        btnApagar.onclick = () => {
          comentariosDiv.removeChild(p);
          const index = savedComments.indexOf(comentario);
          if (index > -1) savedComments.splice(index, 1);
          localStorage.setItem(id + "_comentarios", JSON.stringify(savedComments));
        };
        p.appendChild(btnApagar);
      }

      comentariosDiv.appendChild(p);
      localStorage.setItem(id + "_comentarios", JSON.stringify(savedComments));
      input.value = "";
    }
  });
});

// 🌙 Botão de alternar tema
const btnTema = document.getElementById("theme-toggle");

btnTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const darkAtivo = document.body.classList.contains("dark");

  btnTema.textContent = darkAtivo ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("tema", darkAtivo ? "dark" : "light");
});

// 🌙 Aplica o tema salvo ao carregar a página
if (localStorage.getItem("tema") === "dark") {
  document.body.classList.add("dark");
  btnTema.textContent = "☀️ Light Mode";
}
