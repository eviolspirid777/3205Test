# 3205 Тестовое задание

Сервис для сокращения длинных URL-адресов с использованием React (TypeScript) и Express (TypeScript).

## Структура проекта

Проект состоит из двух основных частей:
- `frontend/` - React приложение
- `backend/` - Express сервер

## Локальный запуск

### Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите сервер разработки:
```bash
npm run dev
```

4. Откройте приложение в браузере:
```
http://localhost:3000
```

### Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Создайте файл `.env` и настройте подключение к базе данных:
```env
DATABASE_URL="postgresql://postgres:94monizi@localhost:5432/url_shortener?schema=public"
```

3. Установите зависимости:
```bash
npm install
```

4. Запустите сервер разработки:
```bash
npm run dev
```

## Docker развертывание

1. Соберите Docker образы:
```bash
docker-compose build
```

2. Запустите контейнеры:
```bash
docker-compose up -d
```

3. Приложение будет доступно по адресу:
```
http://localhost
```

## Ссылки

- Frontend: `http://localhost:80`
- Backend API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Технологии

- Frontend:
  - React
  - TypeScript
  - Vite

- Backend:
  - Express
  - TypeScript
  - Prisma
  - PostgreSQL

- DevOps:
  - Docker
  - Docker Compose