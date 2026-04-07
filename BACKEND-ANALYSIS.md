# Анализ бэкенда — racetrack-info-screens

## Общая картина

**Стек:** Node.js + Fastify (HTTP) + Socket.IO (реалтайм) + TypeScript + Zod (установлен, но не используется — схемы через `json-schema-to-ts`)

**Запуск:** `npm start` → `ts-node apps/server/src/app/server.ts` → порт **3001**, хост `0.0.0.0`

**Статус: проект в ранней стадии. ~40% бэка готово. Фронта нет вообще.**

---

## Структура папок и что за что отвечает

### `apps/server/src/app/` — ядро приложения (инициализация)

| Файл | Что делает | Статус |
|---|---|---|
| `server.ts` | Точка входа. Создаёт Fastify-инстанс, подключает Socket.IO, стартует на порте 3001 | **Готов** |
| `app.ts` | Создаёт Fastify-инстанс, регистрирует плагины и роуты | **Готов** |
| `plugins.ts` | Регистрация Fastify-плагинов (CORS, static-файлы и т.д.) | **Пустой** — плагинов нет |
| `routes.ts` | Регистрация всех HTTP-маршрутов. Подключён только `race-sessions`, остальные закомментированы | **Частично** |
| `socket.ts` | Создаёт Socket.IO сервер с `cors: "*"`, регистрирует `raceGateway` | **Готов** |

### `apps/server/src/state/` — хранилище данных

| Файл | Что делает | Статус |
|---|---|---|
| `in-memory-store.ts` | In-memory хранилище. Два объекта: `store` (глобальное состояние текущей гонки — `currentRace`, `nextSessions`, `finishedSessions`) и класс `RaceSessionStore` (CRUD для сессий через `Map<string, RaceSession>`) | **Готов**, но `store` не используется полноценно |

### `apps/server/src/shared/` — общие типы и константы

| Файл | Что делает |
|---|---|
| `types.ts` | Тип `RaceStatus`: `"idle" \| "countdown" \| "safe" \| "hazard" \| "danger" \| "finish" \| "ended"` |
| `constants.ts` | Socket.IO события: `race:state`, `race:updated`, `race:start`, `race:finish`, `race:end-session` |

### `apps/server/src/modules/race-sessions/` — управление сессиями гонок (Receptionist/Front Desk)

**Это самый готовый модуль.** CRUD для гоночных сессий.

| Файл | Что делает | Статус |
|---|---|---|
| `race-session.types.ts` | Интерфейс `RaceSession`: `{id, name, racerNames[], startTime, endTime, bestLap?}` | **Готов** |
| `race-session.schemas.ts` | JSON Schema для валидации: `raceSessionSchema`, `createRaceSessionSchema`, `updateRaceSessionSchema`, `idParamsSchema` + TypeScript типы через `FromSchema` | **Готов** |
| `race-sessions.routes.ts` | HTTP-эндпоинты: `GET /race-sessions`, `POST /race-sessions`, `PATCH /race-sessions/:id`, `DELETE /race-sessions/:id` | **Готов** |
| `race-sessions.service.ts` | Бизнес-логика: `getAll()`, `create()`, `update()`, `remove()` — работает с `raceStore` | **Готов** |
| `race-session.validators.ts` | Заготовка валидатора, по факту ничего полезного не делает | **Заглушка** |

**Работающие API-эндпоинты:**
- `GET /race-sessions` → `{"items": [], "message": "sessions retrieved successfully"}`
- `POST /race-sessions` → создаёт сессию (body: `{name, racerNames, startTime, endTime}`)
- `PATCH /race-sessions/:id` → обновляет сессию
- `DELETE /race-sessions/:id` → 204

### `apps/server/src/modules/race-control/` — управление гонкой (Safety Official)

| Файл | Что делает | Статус |
|---|---|---|
| `race.gateway.ts` | Socket.IO обработчики: при подключении шлёт `race:state`, слушает `race:start`, `race:finish`, `race:end-session` | **Скелет** — эмитит только `{success: true, message: ""}` |
| `race-control.service.ts` | `getState()`, `startRace()`, `finishRace()`, `endSession()` — всё заглушки, которые возвращают `{success: true}` | **Заглушки** |
| `race-control.routes.ts` | HTTP-роуты для race-control | **Пустой** |

### `apps/server/src/modules/auth/` — аутентификация (access keys)

**Весь модуль пустой.** Все 7 файлов созданы, но без кода:
- `auth.constants.ts` — пуст
- `auth.gateway.ts` — пуст
- `auth.guards.ts` — пуст
- `auth.routes.ts` — пуст
- `auth.schemas.ts` — пуст
- `auth.service.ts` — пуст
- `auth.types.ts` — пуст

### `apps/server/src/modules/system/` — системные маршруты

| Файл | Статус |
|---|---|
| `system.routes.ts` | **Пустой** |

---

## Что НЕ сделано на бэке (список задач)

1. **Auth** — полностью не реализован. Нужно:
   - Чтение access keys из env-переменных (`receptionist_key`, `observer_key`, `safety_key`)
   - Проверка что env-переменные заданы при старте сервера (иначе — не стартовать)
   - Эндпоинт/socket middleware для проверки ключей
   - Задержка 500ms при неверном ключе

2. **Race Control логика** — `startRace()`, `finishRace()`, `endSession()` — заглушки. Нужно:
   - State machine для переходов: idle → safe → hazard/danger → finish → ended
   - Режимы гонки (`safe`, `hazard`, `danger`, `finish`) с реал-тайм уведомлением через Socket.IO
   - Таймер 10 минут (1 минута в dev-режиме)
   - Автоматическое завершение по таймеру

3. **Lap tracking** — нет вообще. Нужно:
   - Socket.IO событие для фиксации пересечения линии
   - Подсчёт кругов для каждой машины
   - Расчёт fastest lap
   - Обновление leaderboard в реал-тайме

4. **Привязка гонщиков к машинам** — нет. По ТЗ при добавлении гонщиков им автоматически назначается номер машины (до 8 машин)

5. **`npm run dev`** — нет скрипта в `package.json` (должен запускать с таймером 1 мин вместо 10)

6. **Plugins** — нет CORS-плагина для Fastify (Socket.IO имеет свой CORS, но HTTP-запросы без CORS не будут работать с фронта)

7. **Раздача статики** — фронтенд нужно будет либо раздавать через Fastify, либо настроить как отдельное приложение

8. **Нет проверки env при старте** — сервер запускается без access keys, хотя по ТЗ должен отказывать

---

## Что реально работает прямо сейчас

Если сделать `npm install && npm start`:
- Сервер стартует на `http://127.0.0.1:3001`
- `GET /race-sessions` → `{"items":[],"message":"sessions retrieved successfully"}` (**работает**)
- CRUD для сессий через REST API работает
- Socket.IO подключение работает, но эмитит только заглушки
- Нет фронтенда, нет auth, нет логики гонок

---

## Для фронтендера — краткое резюме API

### HTTP API (Fastify, порт 3001)

```
GET    /race-sessions          → {items: RaceSession[], message: string}
POST   /race-sessions          → body: {name, racerNames[], startTime, endTime} → RaceSession
PATCH  /race-sessions/:id      → body: Partial<RaceSession> → RaceSession  
DELETE /race-sessions/:id      → 204
```

### Socket.IO (тот же порт 3001)

```
Сервер → Клиент:
  "race:state"   — текущее состояние гонки (при подключении)
  "race:updated" — обновление состояния

Клиент → Сервер:
  "race:start"       — запустить гонку
  "race:finish"      — завершить гонку
  "race:end-session"  — закончить сессию
```

### Типы

```typescript
RaceSession = {id, name, racerNames[], startTime, endTime, bestLap?}
RaceStatus = "idle" | "countdown" | "safe" | "hazard" | "danger" | "finish" | "ended"
```
