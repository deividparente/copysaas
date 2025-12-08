#!/bin/bash

echo "🚀 Raiar Mensagens - Setup Script"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Please edit the .env file with your PostgreSQL credentials:"
    echo "   DATABASE_URL=\"postgresql://USER:PASSWORD@localhost:5432/raiar_mensagens?schema=public\""
    echo ""
    read -p "Press Enter after you've configured the .env file..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🗄️  Setting up database..."
echo ""

# Run migrations
echo "Running Prisma migrations..."
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
else
    echo "❌ Migration failed. Please check your DATABASE_URL in .env"
    exit 1
fi

echo ""
echo "🌱 Seeding database with initial data..."
npm run seed

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📧 Default credentials:"
    echo "   Admin: admin@raiar.com / Raiar@2026"
    echo "   User:  usuario@raiar.com / Raiar@2026"
    echo ""
    echo "🚀 To start the backend server, run:"
    echo "   npm run dev"
else
    echo "❌ Seeding failed"
    exit 1
fi
