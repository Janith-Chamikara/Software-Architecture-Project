import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient, Role, FineStatus } from '../generated/prisma/client';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('Seeding database...');

  // 1. Clean the database (Order matters due to foreign key constraints)
  await prisma.payment.deleteMany();
  await prisma.fine.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash the universal password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('11111111', saltRounds);

  // 3. Create Users
  const admin = await prisma.user.create({
    data: {
      fullName: 'System Admin',
      phoneNumber: '0710000000',
      role: Role.ADMIN,
      passwordHash,
    },
  });

  const officer = await prisma.user.create({
    data: {
      fullName: 'Officer Kamal',
      phoneNumber: '0770000000',
      role: Role.OFFICER,
      passwordHash,
    },
  });

  const driver = await prisma.user.create({
    data: {
      fullName: 'Nimal Perera',
      phoneNumber: '0750000000',
      role: Role.DRIVER,
      passwordHash,
    },
  });

  console.log('Created Users: Admin, Officer, and Driver.');

  // 4. Create Fines (Issued by the Officer)

  // Fine 1: Stays PENDING
  const pendingFine = await prisma.fine.create({
    data: {
      referenceNumber: 'REF-2026-001',
      categoryIdentifier: 'SPEEDING',
      amount: 3500.0,
      status: FineStatus.PENDING,
      district: 'Colombo',
      driverNic: '199512345678',
      officerId: officer.id,
    },
  });

  // Fine 2: Will be marked as PAID
  const paidFine = await prisma.fine.create({
    data: {
      referenceNumber: 'REF-2026-002',
      categoryIdentifier: 'ILLEGAL_PARKING',
      amount: 1500.0,
      status: FineStatus.PAID,
      district: 'Galle',
      driverNic: '199887654321',
      officerId: officer.id,
    },
  });

  console.log('Created Fines: 1 Pending, 1 Paid.');

  // 5. Create Payment (Paid by the Driver for Fine 2)
  await prisma.payment.create({
    data: {
      fineReference: paidFine.referenceNumber,
      userId: driver.id,
      amountPaid: 1500.0,
      paymentMethod: 'VISA',
      transactionId: 'txn_1092837465',
    },
  });

  console.log('Created Payment record for REF-2026-002.');
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
