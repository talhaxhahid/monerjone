import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-serif">
          গোপনীয়তা নীতিমালা (Privacy Policy)
        </h1>
        <p className="text-xs text-slate-400">সর্বশেষ সংস্করণ: সেপ্টেম্বর ২০২৬</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/15 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <h2 className="text-lg font-bold text-amber-300">১. তথ্যের গোপনীয়তা রক্ষা</h2>
        <p>
          MonerJone ব্যবহারকারীদের ব্যক্তিগত তথ্যের সর্বোচ্চ নিরাপত্তা প্রদানে প্রতিশ্রুতিবদ্ধ। আপনার মোবাইল নম্বর, পাসওয়ার্ড এবং ব্যক্তিগত স্পর্শকাতর বিবরণ কখনোই তৃতীয় কোনো পক্ষের কাছে বিক্রি বা অপব্যবহার করা হয় না।
        </p>

        <h2 className="text-lg font-bold text-amber-300">২. মোবাইল নম্বর ও যোগাযোগের তথ্য প্রদর্শন</h2>
        <p>
          ফ্রি প্রোফাইলে কারও মোবাইল নম্বর উন্মুক্ত প্রদর্শিত হয় না। শুধুমাত্র অনুমোদিত ও ভেরিফাইড প্রিমিয়াম মেম্বাররা নির্দিষ্ট সীমার মধ্যে মোবাইল নম্বর আনলক করে যোগাযোগের সুযোগ পান।
        </p>

        <h2 className="text-lg font-bold text-amber-300">৩. ছবি ও বায়োডাটার ব্যবহার</h2>
        <p>
          আপনি যে ছবি বা তথ্য বায়োডাটাতে যুক্ত করবেন, তা শুধুমাত্র উপযুক্ত জীবনসঙ্গী খোঁজার উদ্দেশ্যে নিবন্ধিত সদস্যদের মাঝে প্রদর্শিত হবে। কোনো অবৈধ কাজে এগুলোর ব্যবহার সম্পূর্ণ নিষিদ্ধ।
        </p>
      </div>
    </div>
  );
}
