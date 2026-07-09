 GankLog 🎮⚙️

GankLog es una app full-stack para llevar el registro de tus partidas de League of Legends y ver estadísticas de tu rendimiento — winrate, KDA promedio, campeón más jugado y con mejor winrate, evolución en el tiempo, y más. Pensada como proyecto de portfolio, con una estética propia inspirada en Arcane/Piltover (acero + cobre sobre fondo oscuro).

🔗 Sitio: [https://ganklog.vercel.app](https://ganklog.vercel.app)

 ¿Qué hace?

- Registro de usuarios con email y contraseña (JWT)
- Carga de partidas: campeón, rol, resultado, KDA, duración
- Estadísticas automáticas: winrate general, KDA promedio, campeón más jugado, campeón con mejor winrate
- Edición y eliminación de partidas cargadas
- Filtros por rol y por campeón
- Gráfico de evolución del KDA a lo largo del tiempo
- Feedback visual al cargar partidas (confetti en victoria, animación en derrota)
- Diseño propio con gauge circular de winrate estilo medidor de presión

Tecnologias utilizadas:

Backend
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- PostgreSQL
- Autenticación JWT + BCrypt para hash de contraseñas
- Swagger / OpenAPI (solo en desarrollo)
- Docker (para el despliegue)

Frontend
- React + Vite
- CSS puro con variables de diseño (sin frameworks de UI)
- SVG a mano para gráficos e íconos

Infraestructura
- Backend + base de datos desplegados en [Render](https://render.com)
- Frontend desplegado en [Vercel](https://vercel.com)



 Cómo correrlo en local:

Requisitos previos: 
- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (18+)
- Una base de datos PostgreSQL (podés usar una gratis en [Render](https://render.com) o instalar Postgres local)

1. Cloná el repositorio

bash
git clone https://github.com/peraltavictoria/Ganklog.git
cd Ganklog


 2. Backend

bash
cd GankLog
dotnet restore


Creá un archivo `appsettings.Local.json` en la raíz de `GankLog/` (este archivo no se sube al repo, está en `.gitignore`) con tus propias credenciales:

json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=TU_HOST;Database=TU_DB;Username=TU_USER;Password=TU_PASSWORD;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Jwt": {
    "Key": "UnaClaveSecretaLargaYUnica",
    "Issuer": "GankLog",
    "Audience": "GankLogUsers"
  }
}


Corré las migraciones y levantá el servidor:

bash
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run

La API queda disponible en `http://localhost:5136` (Swagger en `/swagger`, solo en modo desarrollo).

 3. Frontend

En otra terminal:

bash
cd GankLog/ganklog-frontend
npm install
npm run dev


Se abre en `http://localhost:5173`. Si vas a correrlo apuntando a tu backend local, revisá que `src/api.js` tenga:

js
const BASE_URL = 'http://localhost:5136/api'


(en el repo actual apunta a la API de producción en Render — cambiala si querés probar todo en local).

 4. Correr ambos a la vez

Necesitás dos terminales abiertas: una con `dotnet run` (backend) y otra con `npm run dev` (frontend), simultáneamente.


 Variables de entorno (producción):

Al desplegar el backend (por ejemplo en Render), configurá estas variables de entorno en lugar de usar `appsettings.Local.json`:

| Variable | Descripción |
|---|---|
| `ConnectionStrings__DefaultConnection` | Connection string de PostgreSQL |
| `Jwt__Key` | Clave secreta para firmar los tokens JWT |
| `Jwt__Issuer` | Emisor del token (ej. `GankLog`) |
| `Jwt__Audience` | Audiencia del token (ej. `GankLogUsers`) |



 Ver el proyecto en vivo:

No hace falta clonar nada para probarlo — entrá directo a [ganklog.vercel.app](https://ganklog.vercel.app), creá una cuenta y empezá a cargar tus partidas.

---

 Roadmap / próximos pasos:

- Soporte para equipos/roster, no solo estadísticas individuales
- Más gráficos (winrate por campeón, por rol)
- Integración con la API oficial de Riot Games para autocompletar datos de partidas
