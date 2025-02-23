/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "notificationType" AS ENUM ('message', 'alert');

-- CreateEnum
CREATE TYPE "notificationStatus" AS ENUM ('read', 'unread', 'archived');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "createdAt",
DROP COLUMN "read",
DROP COLUMN "text",
DROP COLUMN "updatedAt",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "notificationStatus" NOT NULL DEFAULT 'unread',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "notificationType",
ALTER COLUMN "userId" DROP NOT NULL;
