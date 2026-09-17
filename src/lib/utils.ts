import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BD_DISTRICTS = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura', 'Brahmanbaria',
  'Chandpur', 'Chattogram', 'Chuadanga', 'Cox\'s Bazar', 'Cumilla', 'Dhaka',
  'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj',
  'Jamalpur', 'Jashore', 'Jhalokati', 'Jhenaidah', 'Joypurhat', 'Khagrachhari',
  'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat',
  'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj',
  'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi', 'Natore',
  'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh', 'Patuakhali',
  'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira',
  'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail',
  'Thakurgaon'
];

export const BN_LABELS: Record<string, string> = {
  'Male': 'পুরুষ',
  'Female': 'নারী',
  'Never Married': 'অবিবাহিত',
  'Married - Seeking Another Wife': 'বিবাহিত - দ্বিতীয় বিবাহে আগ্রহী',
  'Divorced': 'ডিভোর্সড',
  'Widowed': 'বিধবা/বিপত্নীক',
  'Primary': 'প্রাথমিক',
  'Secondary': 'মাধ্যমিক',
  'SSC': 'এসএসসি',
  'HSC': 'এইচএসসি',
  'Honours': 'অনার্স / স্নাতক',
  'Masters': 'মাস্টার্স',
  'PhD': 'পিএইচডি',
  '5 times a day': 'দৈনিক ৫ ওয়াক্ত',
  '4 times a day': 'দৈনিক ৪ ওয়াক্ত',
  '3 times a day': 'দৈনিক ৩ ওয়াক্ত',
  'Usually': 'মাঝে মাঝে',
  'Non-Religious': 'ধার্মিক নন',
  'Lower class': 'নিম্নবিত্ত',
  'Middle class': 'মধ্যবিত্ত',
  'Upper middle class': 'উচ্চ মধ্যবিত্ত',
  'Well-established': 'উচ্চবিত্ত / প্রতিষ্ঠিত',
  'No children': 'সন্তান নেই',
  '1 child': '১ সন্তান',
  '2+ children': '২+ সন্তান',
  'No': 'না',
  'Yes': 'হ্যাঁ',
  'Occasionally': 'মাঝে মাঝে',
  'Prefer to discuss privately': 'ব্যক্তিগতভাবে বলতে আগ্রহী',
  'N/A': 'প্রযোজ্য নয়',
  'Wears Hijab': 'হিজাব পরেন',
  'Wears Hijab & Niqab': 'হিজাব ও নিকাব পরেন',
  'Does not currently wear Hijab': 'বর্তমানে হিজাব পরেন না',
  'Undecided / Open to discussion': 'অনিশ্চিত / আলোচনা সাপেক্ষ',
  'Online now': 'অনলাইনে আছেন',
  'Offline': 'অফলাইন',
  'Active now': 'সক্রিয় আছেন',
  'Blocked': 'ব্লক করা হয়েছে',
  'Free': 'ফ্রি',
  'Gold': 'গোল্ড',
  'Platinum': 'প্লাটিনাম',
  'Islam': 'ইসলাম',
  'Hindu': 'হিন্দু',
  'Other': 'অন্যান্য',
  'PENDING': 'অপেক্ষমান',
  'APPROVED': 'অনুমোদিত',
  'REJECTED': 'বাতিল'
};

export function bn(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return BN_LABELS[String(value)] || String(value);
}

export function isBDPhone(phone: string): boolean {
  if (!phone) return false;
  const clean = String(phone).replace(/[\s\-+]/g, '');
  return /^(?:8801|01)[3-9]\d{8}$/.test(clean);
}

export function formatBDPhone(phone: string): string {
  if (!phone) return '';
  let clean = String(phone).replace(/[\s\-+]/g, '');
  if (clean.startsWith('88')) clean = clean.substring(2);
  if (!clean.startsWith('0')) clean = '0' + clean;
  return clean;
}

export function calculateAge(dob: string | Date | null | undefined): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function cmToFeetInches(cm: number | null | undefined): string {
  if (!cm) return '';
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}" (${cm} সেমি)`;
}

export function timeAgo(date: string | Date | number | null | undefined): string {
  if (!date) return '';
  const ts = new Date(date).getTime();
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'এইমাত্র';
  if (min < 60) return `${min} মিনিট আগে`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ঘণ্টা আগে`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} দিন আগে`;
  return new Date(ts).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function computeCompletionScore(user: any, profile: any, photoCount: number): number {
  let score = 20; // Base signup score

  if (profile) {
    if (profile.education) score += 10;
    if (profile.occupation) score += 10;
    if (profile.heightCm) score += 5;
    if (profile.familyStatus) score += 5;
    if (profile.prayerFrequency) score += 10;
    if (profile.introduction && profile.introduction.length >= 20) score += 15;
    if (profile.lookingFor && profile.lookingFor.length >= 20) score += 10;
    if (profile.prefDistrict || profile.prefAgeMin) score += 5;
  }

  if (photoCount > 0) {
    score += 10;
  }

  return Math.min(100, score);
}

export function computeMatchScore(myProfile: any, targetProfile: any): number {
  if (!myProfile || !targetProfile) return 85;
  let score = 70;

  // Age match
  if (myProfile.prefAgeMin && myProfile.prefAgeMax && targetProfile.age) {
    if (targetProfile.age >= myProfile.prefAgeMin && targetProfile.age <= myProfile.prefAgeMax) {
      score += 10;
    }
  }

  // District match
  if (myProfile.prefDistrict && targetProfile.district) {
    if (myProfile.prefDistrict.toLowerCase() === targetProfile.district.toLowerCase()) {
      score += 10;
    }
  }

  // Prayer / Deen match
  if (myProfile.prayerFrequency && targetProfile.prayerFrequency) {
    if (myProfile.prayerFrequency === targetProfile.prayerFrequency) {
      score += 5;
    }
  }

  // Education match
  if (myProfile.prefEducation && targetProfile.education) {
    if (myProfile.prefEducation === targetProfile.education) {
      score += 5;
    }
  }

  return Math.min(99, Math.max(65, score));
}
