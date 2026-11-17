import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear in dependency order so the seed can be re-run safely
  await prisma.payment.deleteMany();
  await prisma.slotShare.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // Users (all fake test data)
  const [admin, amira, hana, selam, meron, liya, ruth] = await Promise.all(
    [
      { name: "Admin", phone: "0900000001", role: Role.ADMIN },
      { name: "Amira", phone: "0900000002", role: Role.MEMBER },
      { name: "Hana", phone: "0900000003", role: Role.MEMBER },
      { name: "Selam", phone: "0900000004", role: Role.MEMBER },
      { name: "Meron", phone: "0900000005", role: Role.MEMBER },
      { name: "Liya", phone: "0900000006", role: Role.MEMBER },
      { name: "Ruth", phone: "0900000007", role: Role.MEMBER },
    ].map((u) => prisma.user.create({ data: { ...u, password } }))
  );

  // Slots: position = payout week
  const slotData: { position: number; holders: { userId: number; share: number }[] }[] = [
    { position: 1, holders: [{ userId: admin.id, share: 1 }] },
    // Split slot: Amira and Hana pay 100 each, receive half each
    {
      position: 2,
      holders: [
        { userId: amira.id, share: 0.5 },
        { userId: hana.id, share: 0.5 },
      ],
    },
    // Double slot: Selam holds slots 3 and 4 (pays 400/week, paid twice)
    { position: 3, holders: [{ userId: selam.id, share: 1 }] },
    { position: 4, holders: [{ userId: selam.id, share: 1 }] },
    { position: 5, holders: [{ userId: meron.id, share: 1 }] },
    // Another split slot
    {
      position: 6,
      holders: [
        { userId: liya.id, share: 0.5 },
        { userId: ruth.id, share: 0.5 },
      ],
    },
  ];

  for (const s of slotData) {
    await prisma.slot.create({
      data: {
        position: s.position,
        shares: { create: s.holders },
      },
    });
  }

  // Week 1 payments: everyone confirmed except Ruth (to test the pending state)
  const shares = await prisma.slotShare.findMany();
  for (const share of shares) {
    const isRuth = share.userId === ruth.id;
    await prisma.payment.create({
      data: {
        slotShareId: share.id,
        week: 1,
        confirmed: !isRuth,
        confirmedAt: isRuth ? null : new Date(),
      },
    });
  }

  console.log("Seeded: 7 users, 6 slots, week 1 payments.");
  console.log("Login with phone 0900000001 / password123 (admin).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());