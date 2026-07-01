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
