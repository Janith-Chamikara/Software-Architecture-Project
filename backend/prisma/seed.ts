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

  const officer1 = await prisma.user.create({
    data: {
      fullName: 'Officer Kamal',
      phoneNumber: '0770000000',
      role: Role.OFFICER,
      passwordHash,
    },
  });

  const officer2 = await prisma.user.create({
    data: {
      fullName: 'Officer Silva',
      phoneNumber: '0771111111',
      role: Role.OFFICER,
      passwordHash,
    },
  });

  const officer3 = await prisma.user.create({
    data: {
      fullName: 'Officer Jayasekara',
      phoneNumber: '0772222222',
      role: Role.OFFICER,
      passwordHash,
    },
  });

  const driver1 = await prisma.user.create({
    data: {
      fullName: 'Nimal Perera',
      phoneNumber: '0750000000',
      role: Role.DRIVER,
      passwordHash,
    },
  });

  const driver2 = await prisma.user.create({
    data: {
      fullName: 'Ravi Kumara',
      phoneNumber: '0751111111',
      role: Role.DRIVER,
      passwordHash,
    },
  });

  const driver3 = await prisma.user.create({
    data: {
      fullName: 'Sanjana De Silva',
      phoneNumber: '0752222222',
      role: Role.DRIVER,
      passwordHash,
    },
  });

  const driver4 = await prisma.user.create({
    data: {
      fullName: 'Malik Hassan',
      phoneNumber: '0753333333',
      role: Role.DRIVER,
      passwordHash,
    },
  });

  console.log('Created Users: 1 Admin, 3 Officers, 4 Drivers.');

  // 4. Create Fines (Issued by the Officers)
  const fines = await Promise.all([
    // Colombo district
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-001',
        categoryIdentifier: 'SPEEDING',
        amount: 3500.0,
        status: FineStatus.PENDING,
        district: 'Colombo',
        driverNic: '199512345678',
        officerId: officer1.id,
      },
    }),
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-002',
        categoryIdentifier: 'ILLEGAL_PARKING',
        amount: 1500.0,
        status: FineStatus.PAID,
        district: 'Colombo',
        driverNic: '199887654321',
        officerId: officer1.id,
      },
    }),
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-003',
        categoryIdentifier: 'RED_LIGHT_VIOLATION',
        amount: 2500.0,
        status: FineStatus.PAID,
        district: 'Colombo',
        driverNic: '198765432109',
        officerId: officer1.id,
      },
    }),
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-004',
        categoryIdentifier: 'NO_SEATBELT',
        amount: 1000.0,
        status: FineStatus.PENDING,
        district: 'Colombo',
        driverNic: '197654321098',
        officerId: officer1.id,
      },
    }),
    // Galle district
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-005',
        categoryIdentifier: 'SPEEDING',
        amount: 3500.0,
        status: FineStatus.PAID,
        district: 'Galle',
        driverNic: '198876543210',
        officerId: officer2.id,
      },
    }),
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-006',
        categoryIdentifier: 'ILLEGAL_PARKING',
        amount: 1500.0,
        status: FineStatus.PAID,
        district: 'Galle',
        driverNic: '197765432109',
        officerId: officer2.id,
      },
    }),
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-007',
        categoryIdentifier: 'RED_LIGHT_VIOLATION',
        amount: 2500.0,
        status: FineStatus.PENDING,
        district: 'Galle',
        driverNic: '196654321098',
        officerId: officer2.id,
      },
    }),
    // Kandy district
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-008',
        categoryIdentifier: 'NO_SEATBELT',
        amount: 1000.0,
        status: FineStatus.PAID,
        district: 'Kandy',
        driverNic: '195543210987',
        officerId: officer3.id,
      },
    }),
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-009',
        categoryIdentifier: 'SPEEDING',
        amount: 3500.0,
        status: FineStatus.PAID,
        district: 'Kandy',
        driverNic: '194432109876',
        officerId: officer3.id,
      },
    }),
    // Jaffna district
    prisma.fine.create({
      data: {
        referenceNumber: 'REF-2026-010',
        categoryIdentifier: 'ILLEGAL_PARKING',
        amount: 1500.0,
        status: FineStatus.PENDING,
        district: 'Jaffna',
        driverNic: '193321098765',
        officerId: officer3.id,
      },
    }),
  ]);

  console.log(`Created ${fines.length} Fines across multiple districts.`);

  // 5. Create Payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        fineReference: fines[1].referenceNumber,
        userId: driver1.id,
        amountPaid: 1500.0,
        paymentMethod: 'VISA',
        transactionId: 'txn_1092837465',
      },
    }),
    prisma.payment.create({
      data: {
        fineReference: fines[2].referenceNumber,
        userId: driver2.id,
        amountPaid: 2500.0,
        paymentMethod: 'MASTERCARD',
        transactionId: 'txn_1092837466',
      },
    }),
    prisma.payment.create({
      data: {
        fineReference: fines[4].referenceNumber,
        userId: driver3.id,
        amountPaid: 3500.0,
        paymentMethod: 'VISA',
        transactionId: 'txn_1092837467',
      },
    }),
    prisma.payment.create({
      data: {
        fineReference: fines[5].referenceNumber,
        userId: driver4.id,
        amountPaid: 1500.0,
        paymentMethod: 'MASTERCARD',
        transactionId: 'txn_1092837468',
      },
    }),
    prisma.payment.create({
      data: {
        fineReference: fines[7].referenceNumber,
        userId: driver1.id,
        amountPaid: 1000.0,
        paymentMethod: 'VISA',
        transactionId: 'txn_1092837469',
      },
    }),
    prisma.payment.create({
      data: {
        fineReference: fines[8].referenceNumber,
        userId: driver2.id,
        amountPaid: 3500.0,
        paymentMethod: 'VISA',
        transactionId: 'txn_1092837470',
      },
    }),
  ]);

  console.log(`Created ${payments.length} Payment records.`);
  console.log('Seeding complete!');
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
