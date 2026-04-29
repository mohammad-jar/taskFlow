-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'TASK_STATUS_UPDATED';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "taskId" TEXT;

-- CreateIndex
CREATE INDEX "Notification_taskId_idx" ON "Notification"("taskId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
