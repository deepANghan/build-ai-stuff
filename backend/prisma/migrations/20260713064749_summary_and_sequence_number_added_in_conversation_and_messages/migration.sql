-- AlterTable
ALTER TABLE "Conversations" ADD COLUMN     "summarized_till" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "summary" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "sequenceNumber" SERIAL NOT NULL;
