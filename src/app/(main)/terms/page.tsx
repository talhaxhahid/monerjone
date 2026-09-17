import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F3FA] font-serif">
          শর্তাবলী ও নীতিমালা (Terms of Service)
        </h1>
        <p className="text-xs text-[#B9AFD1]">সর্বশেষ সংস্করণ: সেপ্টেম্বর ২০২৬</p>
      </div>

      <div className="p-8 rounded-3xl bg-[#1F1640]/90 border border-[#FF4D7E]/20 shadow-2xl space-y-6 text-xs sm:text-sm text-[#B9AFD1] leading-relaxed">
        <h2 className="text-lg font-bold text-[#FF4D7E]">১. ব্যবহারের যোগ্যতা</h2>
        <p>
          MonerJone-এ অ্যাকাউন্ট তৈরি ও ব্যবহারের জন্য ব্যবহারকারীকে অবশ্যই প্রাপ্তবয়স্ক (আইন অনুযায়ী পাত্রের বয়স ন্যূনতম ২১ ও পাত্রীর বয়স ন্যূনতম ১৮ বছর) হতে হবে এবং বিয়ের সৎ উদ্দেশ্য থাকতে হবে।
        </p>

        <h2 className="text-lg font-bold text-[#FF4D7E]">২. ইসলামিক শিষ্টাচার ও নৈতিকতা</h2>
        <p>
          প্ল্যাটফর্মটিতে যেকোনো ধরনের অশ্লীলতা, আপত্তিকর বার্তা প্রেরণ, প্রতারণা বা ভুয়া তথ্য প্রদান সম্পূর্ণ নিষিদ্ধ। এমন কোনো কার্যকলাপ ধরা পড়লে অ্যাকাউন্ট স্থায়ীভাবে বাতিল ও আইনানুগ ব্যবস্থা গ্রহণ করা হবে।
        </p>

        <h2 className="text-lg font-bold text-[#FF4D7E]">৩. মেম্বারশিপ ও পেমেন্ট নীতি</h2>
        <p>
          গোল্ড বা প্লাটিনাম মেম্বারশিপ ফি অফেরতযোগ্য। প্যাকেজের মেয়াদ ৩০ দিন এবং মেয়াদ শেষে ব্যবহারকারী স্বয়ংক্রিয়ভাবে ফ্রি প্ল্যানে স্থানান্তরিত হবেন যদি না তিনি পুনরায় নবায়ন করেন।
        </p>
      </div>
    </div>
  );
}
