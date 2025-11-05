/*
  Warnings:

  - You are about to drop the column `resetPasswordExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'PROFESSIONAL';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "resetPasswordExpires",
DROP COLUMN "resetPasswordToken",
ADD COLUMN     "crp" TEXT,
ADD COLUMN     "specialty" TEXT;
