-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER'
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "purpose" TEXT,
    "paidOutAt" DATETIME
);

-- CreateTable
CREATE TABLE "SlotShare" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slotId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "share" REAL NOT NULL,
    CONSTRAINT "SlotShare_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SlotShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slotShareId" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" DATETIME,
    CONSTRAINT "Payment_slotShareId_fkey" FOREIGN KEY ("slotShareId") REFERENCES "SlotShare" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Slot_position_key" ON "Slot"("position");

-- CreateIndex
CREATE UNIQUE INDEX "SlotShare_slotId_userId_key" ON "SlotShare"("slotId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_slotShareId_week_key" ON "Payment"("slotShareId", "week");
