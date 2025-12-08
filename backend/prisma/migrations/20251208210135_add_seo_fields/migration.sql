-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appName" TEXT NOT NULL DEFAULT 'Raiar Mensagens',
    "primaryColor" TEXT NOT NULL DEFAULT '#5B2DFF',
    "secondaryColor" TEXT NOT NULL DEFAULT '#8B78FF',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "pageTitle" TEXT NOT NULL DEFAULT 'Raiar Mensagens',
    "seoTitle" TEXT NOT NULL DEFAULT 'Raiar Mensagens - Sistema de Mensagens',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "loginBgType" TEXT NOT NULL DEFAULT 'gradient',
    "loginBgValue" TEXT,
    "loginBgGradient" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_settings" ("appName", "createdAt", "id", "loginBgGradient", "loginBgType", "loginBgValue", "logoUrl", "primaryColor", "secondaryColor", "theme", "updatedAt") SELECT "appName", "createdAt", "id", "loginBgGradient", "loginBgType", "loginBgValue", "logoUrl", "primaryColor", "secondaryColor", "theme", "updatedAt" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
