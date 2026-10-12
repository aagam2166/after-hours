import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Seeding database...');

  // ─── Service Areas (Mumbai + Bangalore PINs for prototype) ───────────────
  const serviceAreas = [
    // Mumbai
    { pincode: '400001', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400002', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400005', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400006', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400007', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400008', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400050', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400051', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400053', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400054', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400055', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400056', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400057', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400058', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400059', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400060', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400061', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400062', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400063', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400064', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400065', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400069', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400070', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400072', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400076', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400077', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400080', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400081', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400086', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400097', city: 'Mumbai', state: 'Maharashtra' },
    { pincode: '400099', city: 'Mumbai', state: 'Maharashtra' },
    // Bangalore
    { pincode: '560001', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560008', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560011', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560016', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560025', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560034', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560037', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560038', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560041', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560066', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560068', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560076', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560078', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560080', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560100', city: 'Bangalore', state: 'Karnataka' },
    { pincode: '560103', city: 'Bangalore', state: 'Karnataka' },
    // Ahmedabad (Gujarat)
    { pincode: '380006', city: 'Ahmedabad', state: 'Gujarat' }, // Paldi
    { pincode: '380007', city: 'Ahmedabad', state: 'Gujarat' }, // Ellisbridge
    { pincode: '380009', city: 'Ahmedabad', state: 'Gujarat' }, // Navrangpura
    { pincode: '380015', city: 'Ahmedabad', state: 'Gujarat' }, // Satellite / Vastrapur
    { pincode: '380051', city: 'Ahmedabad', state: 'Gujarat' }, // Prahlad Nagar
    { pincode: '380054', city: 'Ahmedabad', state: 'Gujarat' }, // Bodakdev / SG Highway
    { pincode: '380058', city: 'Ahmedabad', state: 'Gujarat' }, // Bopal
    { pincode: '380059', city: 'Ahmedabad', state: 'Gujarat' }, // South Bopal
    { pincode: '380013', city: 'Ahmedabad', state: 'Gujarat' }, // Naranpura
    { pincode: '382421', city: 'Ahmedabad', state: 'Gujarat' }, // Gandhinagar / GIFT City border
  ];

  for (const area of serviceAreas) {
    await prisma.serviceArea.upsert({
      where: { pincode: area.pincode },
      update: { active: true },
      create: { ...area, active: true },
    });
  }
  console.log(`✅  Seeded ${serviceAreas.length} service areas`);

  // ─── Packages ─────────────────────────────────────────────────────────────
  const packages = [
    {
      name: 'QUICK_RESET' as const,
      displayName: 'Quick Reset',
      tagline: 'For the essentials.',
      description: 'Trash out, space cleared. The basics done fast.',
      basePrice: 1499,
      services: ['TRASH', 'LEFTOVER_FOOD'],
      minGuests: 1,
      maxGuests: 30,
      sortOrder: 1,
    },
    {
      name: 'CUSTOM_RESET' as const,
      displayName: 'Custom Reset',
      tagline: 'Your pick. Our work.',
      description: 'Choose exactly what you need handled. We do those, nothing more.',
      basePrice: 1999,
      services: ['TRASH', 'LEFTOVER_FOOD', 'DECORATIONS', 'GIFTS_AND_STUFF', 'FURNITURE_MESS', 'CLEANING'],
      minGuests: 1,
      maxGuests: 60,
      sortOrder: 2,
    },
    {
      name: 'FULL_RESET' as const,
      displayName: 'Full Reset',
      tagline: 'We handle everything.',
      description: 'Every corner of the aftermath. You wake up to a fresh space.',
      basePrice: 2999,
      services: ['TRASH', 'LEFTOVER_FOOD', 'DECORATIONS', 'GIFTS_AND_STUFF', 'FURNITURE_MESS', 'CLEANING'],
      minGuests: 1,
      maxGuests: 100,
      sortOrder: 3,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { name: pkg.name },
      update: pkg,
      create: pkg,
    });
  }
  console.log(`✅  Seeded ${packages.length} packages`);

  console.log('🎉  Seed complete!');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
