import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// High-quality SVG / WebP base64 placeholder avatars for seed
const AVATAR_MALE_1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="%230F172A"><rect width="200" height="200" rx="30" fill="%230F172A"/><circle cx="100" cy="80" r="40" fill="%23D4AF37"/><path d="M40 180c0-33 27-60 60-60s60 27 60 60" fill="%2338BDF8"/></svg>`;
const AVATAR_FEMALE_1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="%230F172A"><rect width="200" height="200" rx="30" fill="%230F172A"/><circle cx="100" cy="80" r="38" fill="%23F472B6"/><path d="M40 180c0-33 27-60 60-60s60 27 60 60" fill="%23D4AF37"/></svg>`;

async function main() {
  console.log('Seeding MonerJone database...');

  // Hash password
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { phone: '01700000000' },
    update: {},
    create: {
      firstName: 'এডমিন',
      lastName: 'মনিটর',
      gender: 'Male',
      dob: new Date('1994-05-15'),
      district: 'Dhaka',
      religion: 'Islam',
      maritalStatus: 'Never Married',
      phone: '01700000000',
      passwordHash,
      role: 'ADMIN',
      premium: 'Platinum',
      premiumActivatedAt: new Date(),
      profileComplete: true,
      profile: {
        create: {
          heightCm: 175,
          weightKg: 70,
          education: 'Honours',
          subject: 'Computer Science',
          occupation: 'সফটওয়্যার আর্কিটেক্ট',
          income: '৳ ১,৫০,০০০+',
          familyStatus: 'Upper middle class',
          fatherOccupation: 'ব্যবসায়ী',
          motherOccupation: 'গৃহিণী',
          brothers: 1,
          sisters: 1,
          languages: 'বাংলা, ইংরেজি, আরবি',
          prayerFrequency: '5 times a day',
          smoking: 'No',
          introduction: 'আমি নম্র ও ধার্মিক স্বভাবের। পাঁচ ওয়াক্ত নামাজ আদায় করি এবং সুন্নাহ মেনে চলতে ভালোবাসি।',
          longBio: 'পারিবারিক মূল্যবোধ ও হালাল উপার্জনে বিশ্বাসী। সৎ ও প্র্যাকটিসিং জীবনসঙ্গী খুঁজছি।',
          hobbies: JSON.stringify(['বই পড়া', 'ভ্রমণ', 'কুরআন অধ্যয়ন']),
          lookingFor: 'দ্বীনদার, নামাজী ও মার্জিত স্বভাবের পাত্রী প্রত্যাশা করছি।',
          prefAgeMin: 20,
          prefAgeMax: 27,
          prefDistrict: 'Dhaka',
          prefEducation: 'Honours',
        },
      },
      photos: {
        create: [{ dataUrl: AVATAR_MALE_1, position: 0 }],
      },
    },
  });

  // 2. Male Profiles (Grooms)
  const maleSeeds = [
    {
      firstName: 'তানভীর',
      lastName: 'আহমেদ',
      phone: '01711111111',
      dob: new Date('1995-08-20'),
      district: 'Chattogram',
      maritalStatus: 'Never Married',
      premium: 'Gold' as const,
      occupation: 'সিভিল ইঞ্জিনিয়ার',
      education: 'Honours',
      subject: 'Civil Engineering (CUET)',
      heightCm: 178,
      prayerFrequency: '5 times a day',
      intro: 'আলহামদুলিল্লাহ আমি পাঁচ ওয়াক্ত নামাজ পড়ার চেষ্টা করি। পরিবারপ্রেমী ও দায়িত্বশীল।',
      looking: 'পর্দানশীন ও শিক্ষিত পাত্রী খুঁজছি যিনি পারিবারিক বন্ধনকে গুরুত্ব দেন।',
    },
    {
      firstName: 'মাহমুদুল',
      lastName: 'হাসান',
      phone: '01722222222',
      dob: new Date('1992-03-12'),
      district: 'Sylhet',
      maritalStatus: 'Never Married',
      premium: 'Platinum' as const,
      occupation: 'ব্যাংক কর্মকর্তা (ইসলামিক ব্যাংক)',
      education: 'Masters',
      subject: 'Finance & Banking',
      heightCm: 173,
      prayerFrequency: '5 times a day',
      intro: 'শান্ত স্বভাবের, ধার্মিক ও রুচিশীল মানুষ। হালাল উপার্জন ও সুন্নতি জীবনদর্শনে বিশ্বাসী।',
      looking: 'শালীন, দ্বীনদার ও সমমনা মানসিকতার জীবনসঙ্গী প্রত্যাশা করছি।',
    },
    {
      firstName: 'জাহিদ',
      lastName: 'ইকবাল',
      phone: '01733333333',
      dob: new Date('1996-11-05'),
      district: 'Dhaka',
      maritalStatus: 'Never Married',
      premium: 'Free' as const,
      occupation: 'মার্কেটিং ম্যানেজার',
      education: 'Honours',
      subject: 'BBA (Dhaka University)',
      heightCm: 180,
      prayerFrequency: '4 times a day',
      intro: 'সৎ ও বন্ধুসুলভ স্বভাব। পরিবারের সাথে ঢাকায় স্থায়ীভাবে বসবাস করি।',
      looking: 'উচ্চশিক্ষিত ও সহানুভূতিশীল পাত্রী খুঁজছি।',
    },
  ];

  for (const m of maleSeeds) {
    await prisma.user.upsert({
      where: { phone: m.phone },
      update: {},
      create: {
        firstName: m.firstName,
        lastName: m.lastName,
        gender: 'Male',
        dob: m.dob,
        district: m.district,
        religion: 'Islam',
        maritalStatus: m.maritalStatus,
        phone: m.phone,
        passwordHash,
        premium: m.premium,
        premiumActivatedAt: m.premium !== 'Free' ? new Date() : null,
        profileComplete: true,
        profile: {
          create: {
            heightCm: m.heightCm,
            education: m.education,
            subject: m.subject,
            occupation: m.occupation,
            prayerFrequency: m.prayerFrequency,
            introduction: m.intro,
            lookingFor: m.looking,
            hobbies: JSON.stringify(['ভ্রমণ', 'বই পড়া']),
          },
        },
        photos: {
          create: [{ dataUrl: AVATAR_MALE_1, position: 0 }],
        },
      },
    });
  }

  // 3. Female Profiles (Brides)
  const femaleSeeds = [
    {
      firstName: 'সাদিয়া',
      lastName: 'ইসলাম',
      phone: '01811111111',
      dob: new Date('1998-04-10'),
      district: 'Dhaka',
      maritalStatus: 'Never Married',
      premium: 'Platinum' as const,
      occupation: 'লেকচারার (ইংরেজি বিভাগ)',
      education: 'Masters',
      subject: 'English Literature (DU)',
      heightCm: 162,
      hijabNiqab: 'Wears Hijab & Niqab',
      prayerFrequency: '5 times a day',
      intro: 'আমি নিয়মিত হিজাব ও নিকাব পরিধান করি এবং পাঁচ ওয়াক্ত নামাজ আদায় করি। পরিবারই আমার প্রথম প্রাধান্য।',
      looking: 'দ্বীনদার, অধূমপায়ী ও দায়িত্বশীল পাত্র খুঁজছি যিনি ইসলামের পথে পরিবার পরিচালনা করবেন।',
    },
    {
      firstName: 'নুসরাত',
      lastName: 'জাহান',
      phone: '01822222222',
      dob: new Date('1999-09-18'),
      district: 'Rajshahi',
      maritalStatus: 'Never Married',
      premium: 'Gold' as const,
      occupation: 'ডাক্তার (এমবিবিএস)',
      education: 'Honours',
      subject: 'MBBS (Rajshahi Medical College)',
      heightCm: 160,
      hijabNiqab: 'Wears Hijab',
      prayerFrequency: '5 times a day',
      intro: 'আলহামদুলিল্লাহ আমি হিজাব পরিধান করি। চিকিৎসা পেশার পাশাপাশি পরিবার ও দীন পালনে আন্তরিক।',
      looking: 'শিক্ষিত, মার্জিত ও দীনদার পাত্র প্রত্যাশা করছি।',
    },
    {
      firstName: 'ফাতিমা',
      lastName: 'আখতার',
      phone: '01833333333',
      dob: new Date('1997-12-25'),
      district: 'Cumilla',
      maritalStatus: 'Never Married',
      premium: 'Free' as const,
      occupation: 'শিক্ষিকা',
      education: 'Honours',
      subject: 'Islamic Studies',
      heightCm: 157,
      hijabNiqab: 'Wears Hijab & Niqab',
      prayerFrequency: '5 times a day',
      intro: 'কুরআন ও হাদিসের শিক্ষায় অনুপ্রাণিত একটি শান্ত ও সুখী পরিবার গড়াই আমার ইচ্ছা।',
      looking: 'পাঁচ ওয়াক্ত নামাজী ও হালাল উপার্জনে বিশ্বাসী পাত্র খুঁজছি।',
    },
  ];

  for (const f of femaleSeeds) {
    await prisma.user.upsert({
      where: { phone: f.phone },
      update: {},
      create: {
        firstName: f.firstName,
        lastName: f.lastName,
        gender: 'Female',
        dob: f.dob,
        district: f.district,
        religion: 'Islam',
        maritalStatus: f.maritalStatus,
        phone: f.phone,
        passwordHash,
        premium: f.premium,
        premiumActivatedAt: f.premium !== 'Free' ? new Date() : null,
        profileComplete: true,
        profile: {
          create: {
            heightCm: f.heightCm,
            education: f.education,
            subject: f.subject,
            occupation: f.occupation,
            prayerFrequency: f.prayerFrequency,
            hijabNiqab: f.hijabNiqab,
            introduction: f.intro,
            lookingFor: f.looking,
            hobbies: JSON.stringify(['কুরআন তিলাওয়াত', 'রান্না', 'বই পড়া']),
          },
        },
        photos: {
          create: [{ dataUrl: AVATAR_FEMALE_1, position: 0 }],
        },
      },
    });
  }

  // 4. Sample Pending bKash Payment
  const sampleUser = await prisma.user.findFirst({ where: { phone: '01733333333' } });
  if (sampleUser) {
    const existingPayment = await prisma.paymentRequest.findFirst({
      where: { trxId: 'BK928374XA' },
    });
    if (!existingPayment) {
      await prisma.paymentRequest.create({
        data: {
          userId: sampleUser.id,
          plan: 'Gold',
          amount: 1350,
          bKashNumber: '01733333333',
          trxId: 'BK928374XA',
          status: 'PENDING',
        },
      });
    }
  }

  console.log('✅ MonerJone database seed finished successfully!');
}

export { main as seedDatabase };

if (require.main === module || !process.env.NEXT_RUNTIME) {
  main()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

