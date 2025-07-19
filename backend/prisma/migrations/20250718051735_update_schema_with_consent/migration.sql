/*
  Warnings:

  - You are about to drop the column `complaint` on the `Encounter` table. All the data in the column will be lost.
  - Added the required column `type` to the `Encounter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Encounter" DROP COLUMN "complaint",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ConsentForm" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "consentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consentType" TEXT NOT NULL,
    "signatureData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConsentForm" ADD CONSTRAINT "ConsentForm_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
