-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appName" TEXT NOT NULL DEFAULT 'Raiar Mensagens',
    "primaryColor" TEXT NOT NULL DEFAULT '#5B2DFF',
    "secondaryColor" TEXT NOT NULL DEFAULT '#8B78FF',
    "logoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
