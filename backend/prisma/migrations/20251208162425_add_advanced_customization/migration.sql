-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '📁',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_categories" ("createdAt", "id", "name", "order", "updatedAt") SELECT "createdAt", "id", "name", "order", "updatedAt" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE TABLE "new_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appName" TEXT NOT NULL DEFAULT 'Raiar Mensagens',
    "primaryColor" TEXT NOT NULL DEFAULT '#5B2DFF',
    "secondaryColor" TEXT NOT NULL DEFAULT '#8B78FF',
    "logoUrl" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "loginBgType" TEXT NOT NULL DEFAULT 'gradient',
    "loginBgValue" TEXT,
    "loginBgGradient" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_settings" ("appName", "createdAt", "id", "logoUrl", "primaryColor", "secondaryColor", "updatedAt") SELECT "appName", "createdAt", "id", "logoUrl", "primaryColor", "secondaryColor", "updatedAt" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
