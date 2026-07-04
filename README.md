# BikeShop Manager - Frontend Administrativo

Frontend web del panel administrativo de **BikeShop Manager**. La aplicación permite operar y administrar talleres de bicicletas desde una interfaz web, con módulos para dashboard, órdenes de trabajo, clientes, inventario, servicios, proveedores, finanzas, soporte, configuración y administración SaaS.

El proyecto está construido con **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **TanStack Query**, **Zustand** y **Vitest**. Se despliega en **Cloudflare Pages** usando OpenNext para ejecutar Next.js sobre la plataforma de Cloudflare.

## Requisitos

- Node.js 20 o superior.
- pnpm.
- Acceso al repositorio Git.
- Para preview o despliegue en Cloudflare: sesión activa de Wrangler con permisos sobre el proyecto.

## Levantar el proyecto desde `develop`

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd veloservice-web
```

2. Cambiar a la rama `develop` y actualizarla:

```bash
git fetch origin
git checkout develop
git pull --ff-only origin develop
```

3. Instalar dependencias:

```bash
pnpm install
```

4. Configurar variables de entorno locales en `.env.development`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1/
NEXT_PUBLIC_USE_MOCKS=false
CI=true
PNPM_CONFIRM_MODULES_PURGE=false
```

`NEXT_PUBLIC_USE_MOCKS=false` conecta la aplicación con el backend real. Si la variable no existe o tiene otro valor, el frontend usa servicios mock.

5. Iniciar el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

## Ejecutar frontend y backend juntos con Docker Compose

Para levantar este frontend junto con el backend, PostgreSQL y pgAdmin usando Docker Compose, los repositorios deben estar dentro de una carpeta contenedora con la misma estructura actual. El archivo `docker-compose.yml` debe quedar en la carpeta padre, al mismo nivel que `veloservice-backend` y `veloservice-frontend`:

```text
carpeta-contenedora/
├── docker-compose.yml
├── pgadmin/
│   └── servers.json
├── veloservice-backend/
│   ├── Dockerfile
│   ├── .env
│   └── script.sql
└── veloservice-frontend/
    └── veloservice-web/
        ├── Dockerfile
        └── .env.development
```

Desde la carpeta contenedora, levanta todos los servicios con:

```bash
docker compose up --build
```

Para detener y eliminar los contenedores de este entorno:

```bash
docker compose down
```

Contenido requerido de `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: veloservice-postgres
    environment:
      POSTGRES_DB: veloservice_db
      POSTGRES_USER: velo_user
      POSTGRES_PASSWORD: velo_pass

    ports:
      - "5433:5432"
    volumes:
      - ./veloservice-backend/script.sql:/docker-entrypoint-initdb.d/01-script.sql:ro
    networks:
      - veloservice-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U velo_user -d veloservice_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: veloservice-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
      PGADMIN_CONFIG_SERVER_MODE: "False"
      PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED: "False"
    ports:
      - "5050:80"
    volumes:
      - ./pgadmin/servers.json:/pgadmin4/servers.json:ro
    networks:
      - veloservice-network
    depends_on:
      postgres:
        condition: service_healthy

  backend:
    build:
      context: ./veloservice-backend
      dockerfile: Dockerfile
    container_name: veloservice-backend
    env_file:
      - ./veloservice-backend/.env
    environment:
      DD_INSTRUMENT_SERVICE_WITH_APM: "false"
      SPRING_PROFILES_ACTIVE: docker
    ports:
      - "8080:8080"
    networks:
      - veloservice-network
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:8080/api/v1/health || true"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 60s

  web:
    build:
      context: ./veloservice-frontend/veloservice-web
      dockerfile: Dockerfile
    container_name: veloservice-web
    env_file:
      - ./veloservice-frontend/veloservice-web/.env.development
    ports:
      - "3001:3000"
    networks:
      - veloservice-network
    depends_on:
      backend:
        condition: service_healthy

networks:
  veloservice-network:
    driver: bridge
```

## Scripts disponibles

```bash
pnpm dev        # Inicia Next.js en modo desarrollo
pnpm build      # Genera el build de producción de Next.js
pnpm start      # Levanta el build de Next.js localmente
pnpm lint       # Ejecuta ESLint sobre src
pnpm test       # Ejecuta la suite de tests con Vitest
pnpm test:ui    # Abre la UI de Vitest
pnpm preview    # Construye y previsualiza en runtime de Cloudflare
pnpm deploy     # Construye y despliega en Cloudflare
pnpm upload     # Construye y sube el artefacto a Cloudflare
pnpm cf-typegen # Regenera tipos de Cloudflare en cloudflare-env.d.ts
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base del backend de BikeShop Manager. En desarrollo suele apuntar a `http://localhost:8080/api/v1/`. |
| `NEXT_PUBLIC_USE_MOCKS` | Controla si se usan servicios mock. Debe ser `false` para consumir el backend real. |

En producción, `NEXT_PUBLIC_API_URL` también está configurada en `wrangler.jsonc` dentro de `vars`.

## Cloudflare Pages

El despliegue usa `@opennextjs/cloudflare` y `wrangler`. La configuración principal está en `wrangler.jsonc`, incluyendo el nombre del proyecto, assets, compatibilidad de Node.js, observabilidad y variables públicas.

Para probar localmente con el runtime de Cloudflare:

```bash
pnpm preview
```

Para desplegar:

```bash
pnpm deploy
```

Antes de desplegar, iniciar sesión en Cloudflare si es necesario:

```bash
pnpm exec wrangler login
```

## Estructura principal

```text
src/app                  Rutas de Next.js
src/components           Componentes compartidos y UI base
src/features/auth        Login, recuperación, registro y sesión
src/features/panel       Módulos operativos del taller
src/features/admin       Módulos de administración SaaS
src/lib/api              Cliente HTTP y selección de servicios reales/mock
src/test                 Configuración de tests
```

## Flujo recomendado de desarrollo

Trabajar siempre desde `develop` o desde ramas creadas a partir de `develop`:

```bash
git checkout develop
git pull --ff-only origin develop
git checkout -b feature/nombre-de-la-tarea
```

Antes de abrir un pull request, ejecutar:

```bash
pnpm lint
pnpm test
pnpm build
```
