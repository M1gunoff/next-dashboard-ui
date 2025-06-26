-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "EquipmentBooking" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'pending';
