# Toxity — AI Coding Guidelines

This file defines project-wide rules for AI coding agents. Follow the section that matches the area you are working in.

## Project-wide rules

- Before coding for the **app** (frontend), follow the [App rules](#app-react--typescript) below (source: `app/.cursor/rules/main.mdc`).
- Before coding for the **api** (backend), follow the [API rules](#api-nestjs-backend) below (source: `api/.cursor/rules/main.mdc`).

---

# App — React + TypeScript 

## 1. Purpose

This section defines architectural rules, naming conventions, and coding patterns for AI coding agents working in a React + TypeScript project. Follow these rules precisely when reading, writing, or refactoring code.

---

## 2. Project Structure Guidelines

```
src/
├── App.tsx                        # Root: Router > QueryProvider > AppRoutes
├── main.tsx                       # Entry point
├── index.css                      # Tailwind v4 CSS-first config + CSS variables
├── routes/
│   └── routes.ts                  # Centralized Routes object (all frontend paths)
├── config/
│   ├── api/
│   │   ├── axios.ts               # Axios instance with auth interceptor
│   │   └── routes.ts              # Centralized ApiRoutes object (all API endpoints)
│   ├── environments/
│   │   └── index.ts               # Typed and exported env vars
│   └── constants/                 # Static maps and dropdown options
├── features/                      # Domain modules (see Feature Module Pattern)
├── pages/                         # Route-level page components
├── components/
│   ├── layout/                    # Layout shells (sidebar, header, etc.)
│   ├── ui/                        # shadcn/ui base components + custom primitives
│   └── providers/                 # React context providers
├── stores/                        # Zustand stores
├── hooks/                         # Global reusable hooks (not feature-specific)
├── lib/                           # Pure utility functions
├── interfaces/                    # Shared cross-domain interfaces
└── types/                         # Global TypeScript declarations
```

### Feature Module Pattern

Every domain feature lives in `src/features/<feature-name>/` and follows this structure:

```
features/<feature-name>/
├── hooks/
│   └── use-<feature-name>.ts         # TanStack Query hooks (useQuery / useMutation)
├── interfaces/
│   └── <feature-name>.interfaces.ts  # TypeScript interfaces + DTO types + const enums
├── services/
│   └── <feature-name>.services.ts    # Plain async functions wrapping axiosInstance
└── validation-schemas/               # (optional — only if feature has forms)
    └── <feature-name>.schema.ts      # Zod schemas + inferred types
```

### Page Structure

Pages live in `src/pages/<section>/` and may contain nested sub-pages:

```
pages/<section>/
├── index.tsx                      # Top-level page component (route entry)
├── components/                    # Page-local components (not reused elsewhere)
├── hooks/                         # Page-local hooks (UI state only, no API calls)
├── pages/                         # Sub-pages (e.g., new-item, edit-item)
├── utils/                         # Page-local utility functions
└── validation-schemas/            # Page-local Zod schemas (if not in features/)
```

**Do:** Put all data-fetching logic in `features/`. Pages only import from features.  
**Don't:** Put API calls or Zod schemas directly inside page components or hooks.

---

## 3. Naming Conventions

### Files

- All files: `kebab-case` (e.g., `use-feature-name.ts`, `feature-name.services.ts`)
- Exception: shadcn/ui components may use `PascalCase.tsx`

### Components

- Function names: `PascalCase`
- Page components: `<Domain>Page`
- Modal components: `<Domain>Modal`
- Form components: `<Domain>Form`

### Hooks

- File: `use-kebab-case.ts`
- Function: `useCamelCase` (e.g., file `use-feature-name.ts` → exports `useFeatureName`)
- Query hooks: `useGet<Entity>` or `use<Entity>`
- Mutation hooks: `useCreate<Entity>`, `useUpdate<Entity>`, `useDelete<Entity>`

### Types and Interfaces

- Interface files: `<feature>.interfaces.ts`
- Interface names: `PascalCase`, no `I` prefix
- DTO types: `<Action><Entity>Dto` (e.g., `CreateEntityDto`, `UpdateEntityDto`)
- Query param types: `<Entity>QueryType` or `<Entity>Query`

### Validation Schemas

- File: `<feature>.schema.ts`
- Schema names: `camelCase` + `Schema` suffix (e.g., `createEntitySchema`)
- Inferred types: `<Action><Entity>FormData` or `<Entity>FormValues`

### Zustand Stores

- File: `<domain>.ts` in `src/stores/`
- Hook export: `use<Domain>Store`
- State accessor: `get<Domain>StoreState()` (for non-React contexts)
- Store key constant: `const STORE_KEY = "<domain>"` (kebab-case string)

### Method Parameters

- All function and method parameters use `snake_case` (e.g., `entity_id`, `query_params`, `account_uuid`)
- Applies to service functions, hooks, callbacks, and component handlers
- Single-word names are fine as-is (e.g., `id`, `dto`, `query`, `error`)

---

## 4. Component Guidelines

- Page components manage modal open/close state and selected entity identifier
- Delegate API calls to feature hooks; delegate UI state to page-local hooks
- Use `FC` type annotation with explicit props interface
- Default export for pages and layouts; named exports for reusable components
- shadcn/ui components live in `components/ui/` and must not be modified directly — extend via wrappers
- Use `variant` prop pattern from `class-variance-authority` (cva) in base UI components

---

## 5. Hooks Guidelines

- Feature query hooks live in `features/<feature-name>/hooks/`
- Page-local hooks live in `pages/<section>/hooks/` and manage UI state only (no API calls)
- Every mutation hook **must** call `toast()` in both `onSuccess` and `onError`
- `onSuccess` **must** call `queryClient.invalidateQueries` with the base query key
- Use `enabled: !!entity_id` for conditional queries that depend on a runtime value
- Query keys: kebab-case string matching the entity name (e.g., `["entity-name"]`)

---

## 6. State Management Guidelines

Use Zustand for global client state.

- All stores use `devtools` + `persist` middlewares
- Use `partialize` when only part of the state should be persisted
- Expose a `get<Domain>StoreState()` function for non-React contexts (e.g., Axios interceptors)
- Store key is a `const STORE_KEY` string at the top of the store file

---

## 7. Forms and Validation

- Always use `zodResolver` — never manual validation
- Always use shadcn `Form`, `FormField`, `FormItem`, `FormControl`, `FormLabel`, `FormMessage` components
- Schema files export both the Zod schema and its inferred type
- Zod schemas live in `features/<feature-name>/validation-schemas/` or `pages/<section>/validation-schemas/`

---

## 8. Navigation and Routing

**Never hardcode URL strings anywhere in the codebase.** Every frontend path must come from the `Routes` object exported by `@/routes/routes.ts`.

This applies to **all** navigation contexts:
- `<Link to={Routes.auth.sign_in} />`
- `<NavLink to={Routes.dashboard.root} />`
- `<Navigate to={Routes.dashboard.root} replace />`
- `navigate(Routes.dashboard.leads)`
- `window.location.href = Routes.auth.sign_in`
- `fallbackPath` defaults in `ProtectedRoute`

When adding a new route, **always add it to `routes.ts` first**, then reference it via `Routes.*`. Never write string literals like `"/dashboard"`, `"/auth/sign-in"` etc. in component or hook files.

---

## 9. API and Services

- All API endpoints are defined in a single `ApiRoutes` object — never hardcode API path strings
- All frontend paths are defined in a single `Routes` object in `@/routes/routes.ts` — never hardcode URL strings
- All HTTP calls go through a shared `axiosInstance` — never use `fetch` or a raw `axios` import
- Service functions are plain `async` functions — no React hooks inside them
- Always wrap service calls with `try/catch`; throw a human-readable `new Error("...")` message
- Return `response.data` directly, not the full Axios response object
- All env vars are accessed through a typed `environments` object — never use `import.meta.env.*` directly in components or features

---

## 10. Styling Guidelines

- Use Tailwind CSS utility classes — no CSS modules, no inline `style` objects
- Theme tokens (colors, radius, etc.) defined as CSS variables in `index.css`
- Dark mode: class-based (`.dark` on `<html>`)
- Conditional classes: always use `cn()` from `@/lib/utils`
- Use `@/` path alias for all imports — never use relative `../../` paths across folders

---

## 11. TypeScript Guidelines

- Use `const` objects as enums with an extracted union type — do not use the TypeScript `enum` keyword
- No `I` prefix on interface names
- Export DTO and form types alongside the schema or interface that defines the shape
- Use `FC` for page and layout component type annotations with an explicit props interface

---

## 12. Do / Don't Rules

| Do                                                           | Don't                                                |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| Use `@/` alias for all imports                               | Use relative `../../` paths across folders           |
| Import `Routes` from `@/routes/routes.ts` for every link/navigate | Hardcode URL strings like `"/dashboard"` anywhere |
| Add new paths to `routes.ts` before using them               | Write path literals in `<Link>`, `navigate()`, etc.  |
| Define all API paths in a central `ApiRoutes` object         | Hardcode API path strings in service files           |
| Put API calls in `features/<name>/services/`                 | Call `axiosInstance` from components or hooks        |
| Use TanStack Query for all server state                      | Use `useState` + `useEffect` for data fetching       |
| Call `toast()` in every mutation's `onSuccess` and `onError` | Leave mutations silent                               |
| Use `zodResolver` with React Hook Form                       | Write manual form validation logic                   |
| Use `cn()` for conditional classnames                        | Concatenate class strings or use `style={}`          |
| Use shared `lib/` date helpers                               | Call `new Date().toLocaleDateString()` in components |
| Export inferred Zod types next to schemas                    | Re-define types that duplicate schema shape          |
| Use const-object enum pattern with extracted union type      | Use the TypeScript `enum` keyword                    |
| `invalidateQueries` with the base key after mutations        | Target parameterized query keys in mutations         |
| Access env vars through a typed `environments` object        | Access `import.meta.env.VITE_*` directly             |
| Extend shadcn/ui components via wrappers                     | Modify files inside `components/ui/` directly        |
| Use `snake_case` for all method parameters                   | Use `camelCase` for function/method parameter names  |

---

## 13. Examples

### Const-Object Enum Pattern

```ts
export const StatusTypes = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
export type StatusType = (typeof StatusTypes)[keyof typeof StatusTypes];
```

### Service Function

```ts
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";

export const getEntities = async (query?: EntityQueryType): Promise<Entity[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.entities.prefix, { params: query });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch entities. Please try again.");
  }
};
```

### Query Hook

```ts
export const useGetEntities = (query?: EntityQueryType) => {
  return useQuery({
    queryKey: ["entities", query],
    queryFn: () => getEntities(query),
  });
};

// Conditional query
export const useGetEntity = (entity_id: string) => {
  return useQuery({
    queryKey: ["entity", entity_id],
    queryFn: () => getEntity(entity_id),
    enabled: !!entity_id,
  });
};
```

### Mutation Hook

```ts
export const useCreateEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
      toast({ title: "Entity created", description: "...", duration: 2000 });
    },
    onError: (error) => {
      toast({ title: "Could not create entity", description: error.message, variant: "error" });
    },
  });
};
```

### Zod Schema + Inferred Type

```ts
import { z } from "zod";

export const createEntitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type CreateEntityFormData = z.infer<typeof createEntitySchema>;
```

### Form Component Setup

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const form = useForm<CreateEntityFormData>({
  resolver: zodResolver(createEntitySchema),
  defaultValues: { name: "", description: "" },
});
```

### Zustand Store

```ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const STORE_KEY = "domain-name";

export const useDomainStore = create<DomainStore>()(devtools(persist((set) => ({ ...initialValues, setData: (payload) => set((prev_state) => ({ ...prev_state, ...payload })) }), { name: STORE_KEY })));

export const getDomainStoreState = () => useDomainStore.getState();
```

### Navigation — Always Use Routes Object

```ts
// src/routes/routes.ts — add the path here first
export const Routes = {
  auth: {
    sign_in: "/auth/sign-in",
    sign_up: "/auth/sign-up",
  },
  dashboard: {
    root:      "/dashboard",
    leads:     "/dashboard/leads",
    settings:  "/dashboard/settings",
  },
};
```

```tsx
// ✅ Correct — import and reference
import { Routes } from "@/routes/routes";

<Link to={Routes.auth.sign_up}>Sign up</Link>
<NavLink to={Routes.dashboard.leads}>Leads</NavLink>
<Navigate to={Routes.dashboard.root} replace />
navigate(Routes.dashboard.root);
window.location.href = Routes.auth.sign_in;
```

```tsx
// ❌ Wrong — never write path literals
<Link to="/auth/sign-up">Sign up</Link>
navigate("/dashboard");
window.location.href = "/auth/sign-in";
```

### Conditional Classnames

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", is_active && "active-class", class_name)} />;
```

### Page Component

```tsx
const FeaturePage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <FeatureList
        onItemClick={(entity_id) => {
          setSelectedId(entity_id);
          setIsModalOpen(true);
        }}
      />
      <FeatureModal
        id={selectedId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedId(null);
        }}
      />
    </>
  );
};
export default FeaturePage;
```

---

# API — NestJS Backend

## 1. Purpose

This section defines architectural rules, naming conventions, and coding patterns for AI coding agents working in a NestJS + TypeScript backend. Follow these rules precisely when reading, writing, or refactoring code.

---

## 2. Project Structure Guidelines

```
src/
├── main.ts                        # Bootstrap: CORS, Swagger, global middleware
├── app.module.ts                  # Root module: imports all feature modules
├── app.controller.ts              # Minimal root controller (health check only)
├── modules/                       # Feature-based domain modules
├── core/                          # Infrastructure: database, cache, websockets, queues
├── shared/                        # Cross-cutting: guards, decorators, pipes, config, utils
├── integrations/                  # Third-party service wrappers (payment, email, storage, AI)
└── background/                    # Cron jobs and background processors
```

### Key Principles

- `modules/` — every domain feature is self-contained here
- `core/` — low-level infrastructure modules (DB, Redis, WebSockets) with no business logic
- `shared/` — reusable cross-cutting concerns exported and injected anywhere
- `integrations/` — each external service has its own module; never call SDKs directly in feature modules
- `background/` — cron and queue processors are isolated from main request flow

---

## 3. Module Architecture

### Feature Module Structure

Every domain feature follows this exact layout:

```
modules/<feature-name>/
├── <feature-name>.module.ts
├── <feature-name>.controller.ts
├── <feature-name>.service.ts
├── dto/
│   ├── create-<feature-name>.dto.ts
│   ├── update-<feature-name>.dto.ts
│   └── <feature-name>-query.schema.ts   # Zod schema for query params
├── entities/
│   └── <feature-name>.entity.ts         # Swagger response entity
├── interfaces/
│   └── <feature-name>.interface.ts      # TypeScript response interfaces
└── utils/ (optional)
    └── <feature-name>.utils.ts
```

### Module Registration

- Every feature module declares its own controller and service
- `PrismaModule` is imported wherever DB access is needed
- Integration modules are imported into feature modules that need them
- The root `AppModule` imports all feature modules — no dynamic lazy loading

### Internal Modules

Put internal infrastructure facades (mail, SMS, cache, storage, AI) in a dedicated location (e.g., `modules/internal/` or `shared/services/`). Feature modules import these facades — never the underlying SDK directly.

---

## 4. Naming Conventions

### Files

| Type         | Pattern                     | Example                     |
| ------------ | --------------------------- | --------------------------- |
| Module       | `<feature>.module.ts`       | `feature.module.ts`         |
| Controller   | `<feature>.controller.ts`   | `feature.controller.ts`     |
| Service      | `<feature>.service.ts`      | `feature.service.ts`        |
| Create DTO   | `create-<feature>.dto.ts`   | `create-feature.dto.ts`     |
| Update DTO   | `update-<feature>.dto.ts`   | `update-feature.dto.ts`     |
| Entity       | `<feature>.entity.ts`       | `feature.entity.ts`         |
| Interface    | `<feature>.interface.ts`    | `feature.interface.ts`      |
| Query Schema | `<feature>-query.schema.ts` | `feature-query.schema.ts`   |
| Guard        | `<name>.guard.ts`           | `jwt.guard.ts`              |
| Decorator    | `<name>.decorator.ts`       | `current-user.decorator.ts` |
| Strategy     | `<name>.strategy.ts`        | `jwt.strategy.ts`           |
| Pipe         | `<name>.pipe.ts`            | `zod-validation.pipe.ts`    |
| Processor    | `<name>.processor.ts`       | `feature.processor.ts`      |
| Config       | `<service>.config.ts`       | `service.config.ts`         |
| Utils        | `<feature>.utils.ts`        | `feature.utils.ts`          |
| Constants    | `<name>.constants.ts`       | `feature.constants.ts`      |

All files use `kebab-case`.

### Classes

| Type       | Pattern                | Example                                |
| ---------- | ---------------------- | -------------------------------------- |
| Module     | `<Feature>Module`      | `FeatureModule`                        |
| Controller | `<Feature>Controller`  | `FeatureController`                    |
| Service    | `<Feature>Service`     | `FeatureService`                       |
| DTO        | `<Action><Feature>Dto` | `CreateFeatureDto`, `UpdateFeatureDto` |
| Entity     | `<Feature>`            | `Feature`                              |
| Guard      | `<Name>Guard`          | `JwtGuard`, `RolesGuard`               |
| Strategy   | `<Name>Strategy`       | `JwtStrategy`                          |
| Pipe       | `<Name>Pipe`           | `ZodValidationPipe`                    |
| Interface  | `<Feature>[Purpose]`   | `Feature`, `FeatureListResponse`       |

### Method Parameters

- All function and method parameters use `snake_case` (e.g., `account_uuid`, `query_params`, `execution_context`)
- Applies to controllers, services, guards, pipes, decorators, and callbacks
- Single-word names are fine as-is (e.g., `dto`, `query`, `field`, `value`)

---

## 5. Controllers Guidelines

- Controllers handle HTTP routing only — no business logic
- Inject and call the feature's service; nothing else
- Use `@UseGuards(JwtGuard)` for protected routes; add `RolesGuard` when role checks are needed
- Use `@CurrentUser()` to extract the authenticated user from the request
- Use `@CurrentUser('field_name')` to extract a specific field from the user object
- Decorate list endpoints with `@ApiQuery` and validate query params via `ZodValidationPipe`
- Decorate all endpoints and response shapes with `@ApiTags`, `@ApiOperation`, `@ApiResponse` for Swagger
- Use `@UseInterceptors(ClassSerializerInterceptor)` when DTO serialization is needed
- Default HTTP methods: `POST` create, `GET` list/get, `PATCH` update, `DELETE` delete

```ts
@Controller('feature')
@UseGuards(JwtGuard)
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  create(
    @CurrentUser('account_uuid') account_uuid: string,
    @Body() dto: CreateFeatureDto,
  ) {
    return this.featureService.create(account_uuid, dto);
  }

  @Get()
  findAll(
    @CurrentUser('account_uuid') account_uuid: string,
    @Query(new ZodValidationPipe(FeatureQuerySchema)) query: FeatureQueryType,
  ) {
    return this.featureService.findAll(account_uuid, query);
  }
}
```

---

## 6. Services Guidelines

- Services contain all business logic and data access
- Inject `PrismaService` for DB calls — no repository classes
- Inject other services directly via constructor DI when cross-module logic is needed
- Throw NestJS exceptions (`NotFoundException`, `ConflictException`, etc.) — never raw `Error`
- Use `setImmediate(async () => { ... })` for fire-and-forget side effects (emails, notifications) — wrap in `try/catch` internally
- Delete sensitive fields (e.g., passwords) before returning data to the controller
- Services do not call `res` or `req` — they are HTTP-agnostic

```ts
@Injectable()
export class FeatureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otherService: OtherService,
  ) {}

  async create(account_uuid: string, dto: CreateFeatureDto): Promise<Feature> {
    const existing = await this.prisma.feature.findFirst({
      where: { name: dto.name, account_uuid },
    });
    if (existing) throw new ConflictException('Feature already exists');

    const feature = await this.prisma.feature.create({
      data: { ...dto, account_uuid },
    });

    setImmediate(async () => {
      try {
        await this.otherService.notify(feature);
      } catch {}
    });

    return feature;
  }
}
```

---

## 7. DTOs and Validation

### Create DTOs

Use `class-validator` decorators. Add `@ApiProperty` for Swagger.

```ts
export class CreateFeatureDto {
  @ApiProperty({ description: 'Name of the feature', example: 'Example' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
```

### Update DTOs

Always extend `PartialType` from `@nestjs/swagger`:

```ts
export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {}
```

### Query Schemas

Use Zod schemas for query parameter validation (not class-validator):

```ts
export const FeatureQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  search: z.string().optional(),
  order_by: z.enum(['created_at', 'name']).optional().default('created_at'),
  order_direction: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type FeatureQueryType = z.infer<typeof FeatureQuerySchema>;
```

Apply with `ZodValidationPipe` at the controller level:

```ts
@Get()
findAll(@Query(new ZodValidationPipe(FeatureQuerySchema)) query: FeatureQueryType) { ... }
```

### Rules

- Use `class-validator` for body DTOs; use Zod for query schemas
- Always use `PartialType` for update DTOs — never redeclare fields
- Export the inferred Zod type alongside the schema in the same file
- Services trust validated data — no re-validation inside services

---

## 8. Database & Data Access Layer

**ORM**: Prisma with PostgreSQL.

- All DB access is through the injected `PrismaService` — no repository classes, no raw SQL
- `PrismaService` is provided by `PrismaModule`; import `PrismaModule` in any module that needs DB access
- Use Prisma-generated types from `generated/prisma` for enums and model types — do not redeclare them
- Use `upsert()` for create-or-update patterns
- Use `include` for eager loading relations
- Use `Promise.all()` to run independent queries (e.g., data + count) in parallel
- Use `$transaction()` when multiple writes must be atomic

### Pagination Pattern

Return a consistent shape for all paginated list endpoints:

```ts
return {
  data: items,
  pagination: {
    total: count,
    page: query.page,
    limit: query.limit,
    total_pages: Math.ceil(count / query.limit),
    has_next: query.page < Math.ceil(count / query.limit),
    has_prev: query.page > 1,
  },
};
```

### Data Access Rules

- `findUnique` / `findFirst` for single records; `findMany` for lists
- Always pass `skip` and `take` for paginated queries
- Never call Prisma from a controller — always through a service
- Services own all DB interaction

---

## 9. Authentication & Authorization

### Authentication

- JWT with Passport — `passport-jwt` strategy
- Tokens signed with `@nestjs/jwt` and a `JWT_SECRET` from config
- Strategy validates the token and attaches the user payload to `request.user`
- Password hashing with `bcrypt` (salt rounds: 10)

### Guards

- `JwtGuard` — validates Bearer token; throws `UnauthorizedException` on failure
- `RolesGuard` — checks the `@Roles()` decorator metadata; allows privileged roles to bypass restrictions
- WebSocket endpoints use a separate `WsJwtGuard`

### Usage

```ts
@UseGuards(JwtGuard)               // Auth only
@UseGuards(JwtGuard, RolesGuard)   // Auth + role check
@Roles('ADMIN')                    // Set required role

@CurrentUser()                     // Full user object
@CurrentUser('account_uuid')       // Specific field from user
```

### Rules

- All non-public endpoints must have `@UseGuards(JwtGuard)`
- Use `@Roles()` with `RolesGuard` for role-based endpoint restrictions
- Never decode or verify tokens manually in a controller or service
- Auth strategy and guards live in `shared/` — do not duplicate them in feature modules

---

## 10. Error Handling & Logging

### Exception Types

Always throw NestJS exceptions — never a raw `new Error()`:

| Exception               | HTTP | When to use                   |
| ----------------------- | ---- | ----------------------------- |
| `BadRequestException`   | 400  | Invalid input, malformed data |
| `UnauthorizedException` | 401  | Missing or invalid token      |
| `ForbiddenException`    | 403  | Insufficient permissions      |
| `NotFoundException`     | 404  | Resource not found            |
| `ConflictException`     | 409  | Duplicate resource            |

### Error Handling Rules

- Services throw exceptions; the default NestJS exception filter handles HTTP mapping
- Wrap entire service method bodies in `try/catch` only when you need to rethrow with a cleaner message
- Fire-and-forget blocks (`setImmediate`) must always have an internal `try/catch` — failures must not surface
- Use static error code constants for repeated messages (e.g., `ErrorCodes.Feature.ALREADY_EXISTS`)
- Do not add a global exception filter unless the default behavior is insufficient

---

## 11. Configuration & Environment

### Framework

`@nestjs/config` with environment-specific `.env` files.

### Setup

- Validate all env vars at startup using a Zod schema; the app must not boot if validation fails
- Use `ConfigModule.forRoot({ isGlobal: true })` — import it once in `AppModule`
- Export a typed config loader function that maps raw `process.env` values to typed properties
- Access config via injected `ConfigService` — never use `process.env` directly in feature code

```ts
const ConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [`.env.${process.env.NODE_ENV || 'local'}`],
  ignoreEnvFile: process.env.NODE_ENV === 'production',
  load: [envConfig],
  validate: validateEnv,
});
```

### Environment Files

- `.env.local` — local development
- `.env.development` — remote dev
- `.env.staging` — staging
- `.env.production` — production
- `.env.template` — reference file committed to the repo

### Rules

- All env vars are prefixed consistently (e.g., `DATABASE_URL`, `JWT_SECRET`)
- Optional integration keys are `z.string().optional()` in the Zod schema so the app boots without them
- Static app-level config (URLs, categories, fee structures) lives in `shared/config/` as typed constants
- Integration-specific config (API keys, endpoints) lives in `integrations/<service>/config/`

---

## 12. Do / Don't Rules

| Do                                                   | Don't                                           |
| ---------------------------------------------------- | ----------------------------------------------- |
| Put all business logic in services                   | Put logic in controllers                        |
| Use `PrismaService` directly in services             | Create repository classes around Prisma         |
| Use `PartialType(CreateDto)` for update DTOs         | Redeclare properties in update DTOs             |
| Use class-validator for body DTOs                    | Use class-validator for query params            |
| Use Zod schemas for query param validation           | Use manual query param parsing                  |
| Throw NestJS exceptions (`NotFoundException`, etc.)  | Throw `new Error()` from services               |
| Wrap fire-and-forget in `setImmediate` + `try/catch` | `await` side effects in the request path        |
| Import integration modules into feature modules      | Import SDK clients directly into services       |
| Define all guards and decorators in `shared/`        | Duplicate auth logic in feature modules         |
| Use `@nestjs/config` + `ConfigService` for env vars  | Access `process.env` directly in features       |
| Export Zod inferred types next to their schemas      | Re-define types that duplicate Zod shapes       |
| Use `Promise.all()` for independent parallel queries | Await independent DB calls sequentially         |
| Use `$transaction()` for multi-write atomicity       | Make multi-step writes without a transaction    |
| Return paginated lists as `{ data, pagination }`     | Return raw arrays for paginated endpoints       |
| Use Prisma-generated enums from `generated/prisma`   | Redeclare enums that Prisma already provides    |
| Delete sensitive fields before returning data        | Return DB records with hashed passwords or keys |
| Use `@ApiProperty` on all DTO fields                 | Leave Swagger decorators off DTO fields         |
| Use `snake_case` for all method parameters           | Use `camelCase` for function/method parameter names |

---

## 13. Examples

### Feature Module

```ts
@Module({
  imports: [PrismaModule, IntegrationModule],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

### Service with Pagination

```ts
async findAll(account_uuid: string, query: FeatureQueryType) {
  const where = { account_uuid, ...(query.search && { name: { contains: query.search } }) };

  const [items, count] = await Promise.all([
    this.prisma.feature.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { [query.order_by]: query.order_direction },
    }),
    this.prisma.feature.count({ where }),
  ]);

  return {
    data: items,
    pagination: {
      total: count,
      page: query.page,
      limit: query.limit,
      total_pages: Math.ceil(count / query.limit),
      has_next: query.page < Math.ceil(count / query.limit),
      has_prev: query.page > 1,
    },
  };
}
```

### JWT Guard

```ts
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  getRequest(execution_context: ExecutionContext) {
    return execution_context.switchToHttp().getRequest();
  }
}
```

### Roles Guard

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(execution_context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ROLES_KEY, execution_context.getHandler());
    if (!roles) return true;
    const { user } = execution_context.switchToHttp().getRequest();
    return roles.includes(user.role);
  }
}
```

### CurrentUser Decorator

```ts
export const CurrentUser = createParamDecorator(
  (field: string | undefined, execution_context: ExecutionContext) => {
    const request = execution_context.switchToHttp().getRequest();
    return field ? request.user?.[field] : request.user;
  },
);
```

### ZodValidationPipe

```ts
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) throw new BadRequestException(result.error.format());
    return result.data;
  }
}
```

### Prisma Transaction

```ts
async createWithRelated(dto: CreateFeatureDto) {
  return this.prisma.$transaction(async (tx) => {
    const parent = await tx.feature.create({ data: dto });
    await tx.relatedEntity.create({ data: { feature_id: parent.id } });
    return parent;
  });
}
```

### Fire-and-Forget Side Effect

```ts
async create(account_uuid: string, dto: CreateFeatureDto): Promise<Feature> {
  const feature = await this.prisma.feature.create({ data: { ...dto, account_uuid } });

  setImmediate(async () => {
    try {
      await this.notificationService.send({ user_id: feature.user_id, event: 'feature.created' });
    } catch (error) {
      // intentionally swallowed — do not propagate
    }
  });

  return feature;
}
```

### Env Validation (Zod)

```ts
const EnvSchema = z.object({
  NODE_ENV: z.enum(['local', 'development', 'staging', 'production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  EXTERNAL_API_KEY: z.string().optional(),
});

export const validateEnv = (config: Record<string, unknown>) => {
  const result = EnvSchema.safeParse(config);
  if (!result.success)
    throw new Error(`Config validation failed: ${result.error.message}`);
  return result.data;
};
```
