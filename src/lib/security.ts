/**
 * Security and anti-harassment filters
 */

export const FREE_MESSAGE_LIMIT = 5;
export const PHONE_UNLOCK_LIMITS: Record<string, number> = {
  Free: 0,
  Gold: 3,
  Platinum: 10,
};

export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Checks whether a text contains contact information (phone numbers, emails, whatsapp, social links, Bengali numeral sequences)
 */
export function containsContactInfo(text: string | null | undefined): boolean {
  if (!text) return false;

  const str = String(text).toLowerCase();

  // 1. Email pattern
  const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  if (emailPattern.test(str)) return true;

  // 2. URLs / Web links
  const urlPattern = /(?:https?:\/\/|www\.)[^\s]+/i;
  if (urlPattern.test(str)) return true;

  // 3. Social keywords
  const socialKeywords = /(?:whatsapp|viber|telegram|facebook\.com|fb\.com|fb\/|imo|instagram|insta|twitter|imo\s*no|wa\.me)/i;
  if (socialKeywords.test(str)) return true;

  // 4. English numbers: 7+ digits grouped or spaced
  const englishDigitSeq = /(?:\+?880?|01)?[0-9][0-9\s\-._]{6,}[0-9]/;
  if (englishDigitSeq.test(str.replace(/\s+/g, ' '))) return true;

  // 5. Bengali numbers: ০, ১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯
  const bnToEnMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const normalizedBn = str.replace(/[০-৯]/g, (m) => bnToEnMap[m] || m);
  if (englishDigitSeq.test(normalizedBn.replace(/\s+/g, ' '))) return true;

  // 6. Number words in English / Bengali
  const numberWordPatterns = /(?:zero|one|two|three|four|five|six|seven|eight|nine|শূন্য|এক|দুই|তিন|চার|পাঁচ|ছয়|সাত|আট|নয়)\s*(?:zero|one|two|three|four|five|six|seven|eight|nine|শূন্য|এক|দুই|তিন|চার|পাঁচ|ছয়|সাত|আট|নয়)/i;
  if (numberWordPatterns.test(str)) return true;

  return false;
}
