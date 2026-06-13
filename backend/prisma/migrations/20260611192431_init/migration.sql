/*
  Warnings:

  - You are about to drop the `LabInstanceEquipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `experiment_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `experiment_steps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lab_equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lab_instances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wire_connections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `clerkUserId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `university` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `fullName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passwordHash` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LabInstanceEquipment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "experiment_progress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "experiment_steps";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "lab_equipment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "lab_instances";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "modules";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "wire_connections";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "fines" (
    "referenceNumber" TEXT NOT NULL PRIMARY KEY,
    "categoryIdentifier" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "driverNic" TEXT,
    "district" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    CONSTRAINT "fines_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amountPaid" DECIMAL NOT NULL,
    "paidAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "fineReference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "payments_fineReference_fkey" FOREIGN KEY ("fineReference") REFERENCES "fines" ("referenceNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);
INSERT INTO "new_users" ("fullName", "id", "passwordHash") SELECT "fullName", "id", "passwordHash" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_fineReference_key" ON "payments"("fineReference");
