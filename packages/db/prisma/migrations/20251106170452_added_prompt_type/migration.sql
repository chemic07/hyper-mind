/*
  Warnings:

  - You are about to drop the column `createAt` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Prompt` table. All the data in the column will be lost.
  - Added the required column `type` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PromptType" AS ENUM ('USER', 'SYSTEM');

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "PromptType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
