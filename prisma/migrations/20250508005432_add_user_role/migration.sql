-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'customer', 'guest');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'customer';
