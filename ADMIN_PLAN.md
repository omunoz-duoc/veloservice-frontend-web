# Plan de Implementacion: Panel de Administracion del Sistema (/admin)

## 1. Vision General

Crear una nueva ruta `/admin` que funcione como el panel de control exclusivo para el **system admin** de VeloService (multi-tenant). Este admin podra:

1. Gestionar los talleres registrados en la plataforma.
2. Activar/desactivar modulos por taller.
3. Configurar la suscripcion SaaS de cada taller.
4. Visualizar metricas SaaS globales (MRR, churn, crecimiento, etc.).

**Decision arquitectonica clave:** `/admin` vivira en su propio layout group `(admin)` separado del `(panel)` de los usuarios de taller. No compartira el `PanelShell` estandar porque el system admin tiene una navegacion y contexto completamente diferente. Se reutilizaran los tokens de diseno, componentes comunes (`PageHeader`, `KpiCard`, `StatusBadge`, `Field`, shadcn primitives) y los patrones de servicio/mock/provider.

---

## 2. Estructura de Archivos Propuesta

```
src/
  app/
    (admin)/
      layout.tsx              -> AdminLayout con AdminShell (sidebar propio de system admin)
      admin/
        page.tsx              -> Punto de entrada, renderiza AdminDashboardPage
    (panel)/                  -> Existente, sin cambios

  features/
    admin/
      components/
        layout/
          AdminShell.tsx      -> Layout raiz: sidebar system-admin + main area
          AdminSidebar.tsx    -> Navegacion exclusiva para system admin
          AdminTopbar.tsx     -> Topbar simplificado (sin "Nueva OT", etc.)
        dashboard/
          AdminDashboardPage.tsx   -> KPIs SaaS + resumen rapido
          SaasKpiGrid.tsx          -> Tarjetas de metricas globales
          TalleresOverview.tsx     -> Tabla resumen de talleres recientes / estado
        talleres/
          TalleresPage.tsx         -> Listado completo de talleres (tabla, busqueda, filtros)
          TalleresTable.tsx        -> Tabla con paginacion, sorting, acciones
          TalleresFilters.tsx      -> Barra de busqueda + filtros (estado, plan)
          TallerDetailSheet.tsx    -> Slide-in drawer con detalle de un taller
        taller-modules/
          ModulosPage.tsx          -> Vista para activar/desactivar modulos por taller
          TallerModulosForm.tsx    -> Lista de modulos con toggles/checkboxes por taller
        subscriptions/
          SubscriptionsPage.tsx    -> Listado de suscripciones / configuracion de planes
          SubscriptionEditor.tsx   -> Formulario para editar plan/precio/renovacion de un taller
        metrics/
          MetricsPage.tsx          -> Metricas SaaS detalladas (graficos sparklines, tablas)
      services/
        admin.types.ts           -> Tipos compartidos del dominio admin
        admin.service.ts         -> Contrato de servicio (interfaz) + funciones reales (preparadas)
        admin.mock.ts            -> Datos mock + funciones async con delay
        admin.provider.ts        -> Provider que conecta mock -> service interface
      hooks/
        useAdminTalleres.ts      -> Hook de react-query para listar talleres
        useAdminMetrics.ts       -> Hook para KPIs SaaS
        useAdminModulos.ts       -> Hook para modulos
        useAdminSubscriptions.ts -> Hook para suscripciones
      context/
        AdminContext.tsx         -> (Opcional v1) Context para estado local si es necesario
```

---

## 3. Tipos de Datos (Dominio Admin)

```typescript
// src/features/admin/services/admin.types.ts

export type EstadoTaller = "activo" | "inactivo" | "pendiente" | "suspendido";
export type PlanSaaS = "starter" | "pro" | "enterprise";
export type EstadoSuscripcion = "activa" | "vencida" | "cancelada" | "trial";

export interface TallerAdmin {
  id: string;
  nombre: string;
  rut: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: EstadoTaller;
  plan: PlanSaaS;
  fechaRegistro: string;      // ISO
  fechaRenovacion: string;    // ISO
  cantidadUsuarios: number;
  cantidadOTsMes: number;
  moduloIds: string[];        // Modulos activados
}

export interface ModuloSaaS {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: "core" | "add-on";
  iconKey: string;            // nombre del icono lucide
}

export interface SuscripcionTaller {
  tallerId: string;
  tallerNombre: string;
  plan: PlanSaaS;
  precioMensual: number;
  estado: EstadoSuscripcion;
  fechaInicio: string;
  fechaRenovacion: string;
  diasRestantes: number;
  mrr: number;                // Monthly Recurring Revenue de este taller
}

export interface SaasKpis {
  totalTalleres: number;
  talleresActivos: number;
  talleresNuevosMes: number;
  mrrTotal: number;           // CLP
  mrrDelta: string;           // e.g. "+12% vs mes anterior"
  churnRate: string;          // e.g. "2.3%"
  trialToPaidRate: string;    // e.g. "68%"
}

export interface MetricasSaaSDetalle {
  mrrHistorico: { mes: string; mrr: number }[];
  nuevosTalleresHistorico: { mes: string; count: number }[];
  churnHistorico: { mes: string; rate: number }[];
  distribucionPlanes: { plan: PlanSaaS; count: number }[];
}
```

---

## 4. Mock Data (Datos de Prueba)

Se implementaran ~10 talleres de prueba con variedad de planes, estados y modulos activados para cubrir todos los casos de UI:

- Talleres en plan Starter, Pro, Enterprise
- Talleres activos, inactivos, suspendidos, en trial
- Modulos mixtos activados (inventario, finanzas, multi-sucursal, etc.)
- Suscripciones con fechas variadas (pronto a vencer, recien renovadas, vencidas)

**Patron:** Exactamente igual que los mocks existentes (`delay()` + variables mutables en memoria para simular updates).

---

## 5. Paginas y Componentes Detallados

### 5.1 Layout y Navegacion

**`AdminShell.tsx`**
- Estructura similar a `PanelShell` pero con fondo `bg-vs-bg` y grid propio.
- Sidebar mas angosto o igual (w-[240px]) con grupos de navegacion:
  - **Plataforma**: Dashboard, Talleres, Suscripciones, Modulos
  - **Metricas**: SaaS Analytics
  - **Sistema**: Configuraciones (v2)

**`AdminSidebar.tsx`**
- Mismo estilo visual del sidebar actual (grupos, iconos lucide, badges de conteo, estados activos `bg-vs-ink text-white`).
- Logo cambia levemente: "VELOSERVICE" con subtitulo "Administracion".
- Links: `/admin` (Dashboard), `/admin/talleres`, `/admin/suscripciones`, `/admin/modulos`, `/admin/metricas`.

**`AdminTopbar.tsx`**
- Simplificado: sin boton "Nueva OT", sin contexto de taller especifico.
- Mantiene buscador global (visible) para buscar talleres por nombre/RUT.
- Dropdown de usuario igual al actual pero adaptado si el rol es `sysadmin`.

### 5.2 Admin Dashboard (`/admin`)

**Componentes:**
- `PageHeader`: titulo "Panel de Administracion", breadcrumb `[Admin]`.
- `SaasKpiGrid`: Reutiliza `KpiCard` con metricas globales:
  - Total Talleres (icon: `Building2`)
  - MRR Total (icon: `TrendingUp`)
  - Talleres Nuevos (Mes) (icon: `UserPlus`)
  - Churn Rate (icon: `TrendingDown`)
  - Suscripciones por Vencer (icon: `CalendarClock`)
- `TalleresOverview`: Tabla compacta (ultimos 5 talleres registrados) con badge de estado.
- `DistribucionPlanes`: Card con barras de progreso horizontales mostrando cuantos talleres hay en Starter/Pro/Enterprise.

### 5.3 Gestion de Talleres (`/admin/talleres`)

**Componentes:**
- `TalleresPage`: layout con PageHeader + acciones ("Nuevo Taller" - mock, "Exportar" - mock).
- `TalleresFilters`:
  - Input de busqueda con icono `Search`.
  - Filtro por plan: tabs/buttons (Todos / Starter / Pro / Enterprise).
  - Filtro por estado: select/tabs (Todos / Activo / Inactivo / Trial / Suspendido).
- `TalleresTable`:
  - Tabla con columnas: Nombre, RUT, Plan, Estado, Usuarios, OTs Mes, Renovacion, Acciones.
  - Estados renderizados con `StatusBadge` (nuevos colores para admin si es necesario, o reutilizar los existentes).
  - Acciones por fila: "Ver detalle" -> abre `TallerDetailSheet`.
  - Paginacion simple (mock con slice de arrays).
- `TallerDetailSheet`:
  - Slide-in desde la derecha (animacion `vs-slide-in-right` ya existente).
  - Muestra datos completos del taller.
  - Seccion "Modulos activos" con lista de chips.
  - Seccion "Suscripcion" con plan, precio, proxima renovacion.
  - Botones de accion: "Editar" (mock), "Suspender" / "Activar" (toggle estado).

### 5.4 Modulos por Taller (`/admin/modulos`)

**Componentes:**
- `ModulosPage`: PageHeader + selector de taller (dropdown/search).
- `TallerModulosForm`:
  - Lista de todos los modulos disponibles (mock ~8 modulos).
  - Cada modulo es una fila/card con:
    - Icono + Nombre + Descripcion
    - Badge de categoria (`core` | `add-on`)
    - Toggle switch (`Checkbox` de shadcn o custom toggle) para activar/desactivar.
  - Al cambiar un toggle, se actualiza el estado local y se dispara un mock PUT con `delay(400)`.
  - Indicador visual de cambios sin guardar (si se desea en v1, o simular auto-guardado).

### 5.5 Suscripciones (`/admin/suscripciones`)

**Componentes:**
- `SubscriptionsPage`: PageHeader + tabla de suscripciones.
- Tabla con columnas: Taller, Plan, Precio Mensual, Estado, Inicio, Renovacion, Dias Restantes.
- Filtros por plan y estado.
- Accion "Editar" -> abre `SubscriptionEditor` (modal o sheet).
- `SubscriptionEditor`:
  - Formulario con `Field` reutilizables.
  - Select de Plan (Starter/Pro/Enterprise).
  - Input de precio mensual (CLP).
  - Input de fecha de renovacion.
  - Toggle de estado (Activa / Cancelada / Trial).
  - Botones: Guardar (mock), Cancelar.

### 5.6 Metricas SaaS (`/admin/metricas`)

**Componentes:**
- `MetricsPage`: PageHeader.
- KPIs repetidos de la dashboard pero con sparklines historicos (reutilizar `Sparkline`).
- Seccion "Crecimiento de Talleres": tabla o lista con barras de progreso.
- Seccion "MRR Historico": card con sparkline de 12 meses.
- Seccion "Distribucion de Planes": cards horizontales con porcentajes.
- Seccion "Talleres por Vencer": tabla filtrada de suscripciones con `diasRestantes < 30`.

---

## 6. Reutilizacion de Estilos y Componentes

| Recurso Existente | Uso en /admin |
|---|---|
| `globals.css` tokens (vs-bg, vs-card, vs-ink, etc.) | Directo. Sin cambios. |
| `PageHeader` | Reutilizar para todas las paginas admin. |
| `KpiCard` | Reutilizar para SaaS KPIs. Quizas extender `KpiAccent` con "ink" si es necesario. |
| `StatusBadge` | Reutilizar o crear variantes admin (`trial`, `suspendido`). |
| `Sparkline` | Reutilizar para metricas historicas. |
| `Field` | Reutilizar en formularios de suscripcion. |
| shadcn/ui primitives (`Card`, `Button`, `Input`, `Checkbox`, `Badge`, `Select`) | Reutilizar en formularios y tablas. |
| `cn()` utility | Reutilizar en todos los componentes nuevos. |
| Patron `service.ts` / `mock.ts` / `provider.ts` | Replicar exactamente. |
| Patron route page thin + feature component | Replicar exactamente. |

**Nuevos tokens/admin-specific CSS:** No se agregaran. Se mantendran los existentes para consistencia visual.

---

## 7. Autenticacion y Autorizacion

- En v1, el `AuthGuard` actual solo verifica que exista `user`. Se extendera (o se creara `AdminAuthGuard`) para verificar que `user.rol === "sysadmin"`.
- Si un usuario no-sysadmin intenta acceder a `/admin`, sera redirigido a `/dashboard`.
- El `AdminLayout` envolvera con `AdminAuthGuard`.
- Ajuste en `auth.store.ts` / `User` type: el campo `rol` ya es `string`, por lo que `"sysadmin"` es compatible. No requiere cambios de tipo inmediatos.

---

## 8. Dependencias y Librerias

No se requieren librerias nuevas. Todo se construye con:
- React + Next.js (existentes)
- Tailwind CSS v4 (existente)
- Lucide React (existente)
- TanStack Query (existente)
- Zustand (existente)
- shadcn/ui primitives (existentes)

**Nota:** Si en el futuro se desean graficos complejos (mas alla de sparklines), se evaluara `recharts` o similar, pero para la version MVP los sparklines y barras de progreso CSS son suficientes.

---

## 9. Fases de Implementacion (Orden Recomendado)

### Fase 1: Infraestructura y Tipos (1 sesion)
1. Crear carpeta `src/features/admin/`.
2. Definir `admin.types.ts` con todos los tipos de dominio.
3. Crear `admin.mock.ts` con datos de prueba robustos (~10 talleres, 8 modulos, suscripciones variadas).
4. Crear `admin.service.ts` (interfaces + stubs de endpoints reales futuros).
5. Crear `admin.provider.ts` (conecta mocks a interfaces).

### Fase 2: Layout y Navegacion (1 sesion)
1. Crear `AdminSidebar`, `AdminTopbar`, `AdminShell`.
2. Crear `AdminAuthGuard`.
3. Crear `src/app/(admin)/layout.tsx`.
4. Verificar que `/admin` carga con shell correcto y navegacion funcional entre secciones (incluso si las paginas hijas estan vacias).

### Fase 3: Dashboard SaaS (`/admin`) (1 sesion)
1. Implementar `AdminDashboardPage`.
2. Implementar `SaasKpiGrid` reutilizando `KpiCard`.
3. Implementar `TalleresOverview` (tabla resumen).
4. Implementar `DistribucionPlanes` (barras de progreso).

### Fase 4: Gestion de Talleres (`/admin/talleres`) (1-2 sesiones)
1. Implementar `TalleresPage` + `TalleresFilters`.
2. Implementar `TalleresTable` con paginacion mock.
3. Implementar `TallerDetailSheet` con slide-in animation.
4. Hook `useAdminTalleres` con TanStack Query.

### Fase 5: Modulos por Taller (`/admin/modulos`) (1 sesion)
1. Implementar `ModulosPage`.
2. Implementar `TallerModulosForm` con toggles.
3. Hook `useAdminModulos`.

### Fase 6: Suscripciones (`/admin/suscripciones`) (1 sesion)
1. Implementar `SubscriptionsPage` + tabla.
2. Implementar `SubscriptionEditor` (modal/sheet).
3. Hook `useAdminSubscriptions`.

### Fase 7: Metricas Detalladas (`/admin/metricas`) (1 sesion)
1. Implementar `MetricsPage`.
2. Reutilizar `Sparkline` para series historicas.
3. Crear vistas de tablas filtradas (por vencer, etc.).

### Fase 8: Pulido y Pruebas (1 sesion)
1. Revisar responsive basico (scroll en tablas, stack de KPIs en mobile).
2. Revisar accesibilidad (roles tab, aria-labels, focus en toggles).
3. Verificar que no hay fugas de estilo hacia `(panel)`.
4. Sanity check de build (`next build` sin errores).

---

## 10. Notas de Diseno (Checklist Visual)

- [ ] Fondo de pagina: `bg-vs-bg` en shell principal.
- [ ] Cards: `bg-vs-card border border-vs-line rounded-[24px]`.
- [ ] Botones primarios: `bg-vs-ink text-white rounded-full`.
- [ ] Botones secundarios: `bg-vs-chip text-vs-ink rounded-full`.
- [ ] Tablas: header con fondo sutil, filas con hover `hover:bg-vs-chip`, bordes redondeados en tabla envuelta en card.
- [ ] Estados (badges):
  - Activo: `bg-vs-good-bg text-vs-good`
  - Inactivo/Suspendido: `bg-vs-warn-bg text-vs-warn`
  - Trial: `bg-vs-info-bg text-vs-info`
  - Pendiente: `bg-vs-violet-bg text-vs-violet`
- [ ] Inputs: bordes `border-vs-line-2`, focus ring `ring-vs-violet`.
- [ ] Todos los iconos desde `lucide-react`, strokeWidth 1.6, size 16-18.
- [ ] Transiciones: `transition-colors` en botones y filas de tabla.

---

## 11. Endpoints Futuros (Placeholder)

En `admin.service.ts` se dejaran los siguientes stubs comentados o definidos para cuando el backend este listo:

```typescript
// GET   /admin/talleres
// GET   /admin/talleres/:id
// PUT   /admin/talleres/:id/estado
// GET   /admin/modulos
// GET   /admin/talleres/:id/modulos
// PUT   /admin/talleres/:id/modulos
// GET   /admin/suscripciones
// PUT   /admin/suscripciones/:tallerId
// GET   /admin/metrics/saas-kpis
// GET   /admin/metrics/historical
```

---

## 12. Riesgos y Decisiones Pendientes

| Tema | Decision | Justificacion |
|---|---|---|
| ¿Admin dentro de `(panel)` o separado? | **Separado** en `(admin)` | El admin no gestiona OTs ni inventario; su contexto es global. Un layout propio evita contaminar el `PanelShell` con logica de rol sysadmin. |
| ¿Reutilizar `AuthGuard` o crear `AdminAuthGuard`? | **Crear `AdminAuthGuard`** | Simple extension que chequea `user.rol === "sysadmin"` y redirige a `/dashboard` si no. |
| ¿Paginacion real o mock con slice? | **Mock con slice** en v1 | Los endpoints aun no existen. Cuando existan, se reemplaza el fetch del provider. |
| ¿Formularios con react-hook-form? | **No en v1** | Los formularios son simples (pocos campos). Se usa `useState` directamente, igual que en `ConfiguracionPage`. |
| ¿Graficos pesados? | **No** | Sparklines + barras CSS son suficientes para MVP. |

---

**Preparado para iniciar implementacion.**
