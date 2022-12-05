-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);
