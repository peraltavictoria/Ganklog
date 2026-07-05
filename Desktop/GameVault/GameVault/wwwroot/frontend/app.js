const API = "/api/games";

// abrir/cerrar modal
document.getElementById("toggleForm").onclick = () => {
    document.getElementById("formContainer").classList.toggle("hidden");
};

// cargar juegos
async function loadGames() {
    const res = await fetch(API);
    const games = await res.json();

    const container = document.getElementById("games");
    container.innerHTML = "";

    games.forEach(g => {
        container.innerHTML += `
        <div class="card">
            <h3>${g.title}</h3>

            <span class="tag">${g.genre}</span>
            <span class="tag">${g.platform}</span>

            <p>${g.status}</p>

            <button onclick="deleteGame(${g.id})">🗑</button>
            <button onclick="editGame(${g.id})">✏</button>
        </div>
        `;
    });
}

// crear juego
async function createGame() {
    const game = {
        title: document.getElementById("title").value,
        genre: document.getElementById("genre").value,
        platform: document.getElementById("platform").value,
        status: document.getElementById("status").value
    };

    await fetch(API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(game)
    });

    document.getElementById("formContainer").classList.add("hidden");
    loadGames();
}

// borrar
async function deleteGame(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadGames();
}

// editar (simple)
async function editGame(id) {
    const title = prompt("Nuevo título:");
    const status = prompt("Nuevo estado:");

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            id,
            title,
            genre: "Editado",
            platform: "PC",
            status
        })
    });

    loadGames();
}

loadGames();