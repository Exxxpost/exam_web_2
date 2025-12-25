@echo off
echo Запуск системы управления библиотекой...
echo.

echo 1. Проверка подключения к базе данных...
cd backend
node -e "
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
pool.connect()
  .then(() => {
    console.log('✓ Подключение к базе данных успешно');
    process.exit(0);
  })
  .catch(err => {
    console.log('✗ Ошибка подключения к базе данных:', err.message);
    console.log('Убедитесь, что PostgreSQL запущен и настройки в .env файле корректны');
    process.exit(1);
  });
"

if %errorlevel% neq 0 (
    echo.
    echo Для настройки базы данных:
    echo 1. Установите PostgreSQL
    echo 2. Создайте базу данных 'exam_web'
    echo 3. Выполните скрипт init_db.sql
    echo 4. Проверьте настройки в backend/.env
    pause
    exit /b 1
)

echo.
echo 2. Запуск сервера...
start "Library Backend" cmd /k "npm start"

echo.
echo 3. Открытие браузера...
timeout /t 3 /nobreak > nul
start http://localhost:3000

echo.
echo Система запущена!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3000/index.html
echo.
echo Тестовые учетные данные:
echo Email: admin@library.ru
echo Пароль: admin123
echo.
pause