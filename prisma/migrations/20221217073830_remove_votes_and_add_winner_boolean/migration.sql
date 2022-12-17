/*
  Warnings:

  - You are about to drop the column `votedProjectId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_votedProjectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "winner" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "votedProjectId";
