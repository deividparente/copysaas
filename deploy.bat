@echo off
REM ============================================
REM RAIAR MENSAGENS - DEPLOY COM DOCKER COMPOSE
REM ============================================

setlocal enabledelayedexpansion

cls
echo.
echo 🚀 Raiar Mensagens - Deploy Script (Windows)
echo =============================================
echo.

REM Verificar Docker
echo 📋 Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker não está instalado
    pause
    exit /b 1
)
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker Compose não está instalado
    pause
    exit /b 1
)
echo ✓ Docker e Docker Compose encontrados
echo.

REM Verificar .env
echo 📋 Verificando arquivo .env...
if not exist ".env" (
    echo ⚠ .env não encontrado, criando a partir de .env.example
    copy .env.example .env >nul
    echo ✗ Por favor, edite .env com suas variáveis!
    echo.
    echo Abra o arquivo .env e preencha:
    echo   - DB_PASSWORD
    echo   - JWT_SECRET
    echo   - FRONTEND_URL
    echo   - BACKEND_URL
    pause
    exit /b 1
)
echo ✓ .env encontrado
echo.

REM Build
echo 🔨 Build dos containers...
docker-compose build
if errorlevel 1 (
    echo ✗ Erro no build
    pause
    exit /b 1
)
echo ✓ Build concluído
echo.

REM Stop containers antigos
echo ⏹️  Parando containers antigos...
docker-compose down
echo ✓ Containers parados
echo.

REM Start containers
echo ▶️  Iniciando containers...
docker-compose up -d
if errorlevel 1 (
    echo ✗ Erro ao iniciar containers
    pause
    exit /b 1
)
echo ✓ Containers iniciados
echo.

REM Aguardar health checks
echo ⏳ Aguardando serviços ficarem prontos...
timeout /t 5 /nobreak
echo.

REM Status
echo 📊 Status dos containers:
docker-compose ps
echo.

REM Sucesso
echo ============================================
echo ✓ Deploy concluído com sucesso!
echo ============================================
echo.
echo 📍 Acesse a aplicação:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo    Nginx: http://localhost/
echo.
echo 🔐 Login padrão:
echo    Email: admin@admin.com
echo    Senha: admin
echo.
echo 📊 Ver logs:
echo    docker-compose logs -f
echo.
echo 🛑 Parar:
echo    docker-compose down
echo.
pause
