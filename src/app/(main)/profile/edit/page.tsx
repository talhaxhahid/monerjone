'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BD_DISTRICTS } from '@/lib/utils';
import { compressImageToWebP } from '@/lib/image-compressor';
import {
  User,
  GraduationCap,
  Sparkles,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  AlertCircle
} from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function ProfileEditWizardPage() {
  const router = useRouter();
  const { user, loading: authLoading, addToast } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState<any>({
    heightCm: '',
    weightKg: '',
    district: '',
    maritalStatus: '',
    religion: 'Islam',
    children: 'No children',
    education: '',
    subject: '',
    occupation: '',
    income: '',
    familyStatus: 'Middle class',
    fatherOccupation: '',
    motherOccupation: '',
    brothers: 0,
    sisters: 0,
    languages: 'Bangla, English',
    prayerFrequency: '5 times a day',
    hijabNiqab: 'Wears Hijab',
    smoking: 'No',
    hobbies: [] as string[],
    favoriteBooks: '',
    favoriteFood: '',
    introduction: '',
    longBio: '',
    lookingFor: '',
    prefAgeMin: 18,
    prefAgeMax: 35,
    prefHeight: '',
    prefEducation: '',
    prefDistrict: '',
    workPreference: '',
    photos: [] as string[],
  });

  const [hobbyInput, setHobbyInput] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadCurrentProfile() {
      try {
        const res = await fetch('/api/profiles/me');
        if (res.ok) {
          const data = await res.json();
          const p = data.profile;
          if (p) {
            const safeHobbies = Array.isArray(p.hobbies)
              ? p.hobbies
              : typeof p.hobbies === 'string'
              ? (() => {
                  try {
                    const parsed = JSON.parse(p.hobbies);
                    return Array.isArray(parsed) ? parsed : [];
                  } catch {
                    return [];
                  }
                })()
              : [];

            const safePhotos = Array.isArray(p.rawPhotos)
              ? p.rawPhotos.filter((ph: any) => ph && typeof ph === 'string')
              : Array.isArray(p.photos)
              ? p.photos.filter((ph: any) => ph && typeof ph === 'string')
              : [];

            setFormData({
              heightCm: p.heightCm || '',
              weightKg: p.weightKg || '',
              district: p.district || '',
              maritalStatus: p.maritalStatus || 'Never Married',
              religion: p.religion || 'Islam',
              children: p.children || 'No children',
              education: p.education || '',
              subject: p.subject || '',
              occupation: p.occupation || '',
              income: p.income || '',
              familyStatus: p.familyStatus || 'Middle class',
              fatherOccupation: p.fatherOccupation || '',
              motherOccupation: p.motherOccupation || '',
              brothers: p.brothers || 0,
              sisters: p.sisters || 0,
              languages: p.languages || 'Bangla, English',
              prayerFrequency: p.prayerFrequency || '5 times a day',
              hijabNiqab: p.hijabNiqab || 'Wears Hijab',
              smoking: p.smoking || 'No',
              hobbies: safeHobbies,
              favoriteBooks: p.favoriteBooks || '',
              favoriteFood: p.favoriteFood || '',
              introduction: p.introduction || '',
              longBio: p.longBio || '',
              lookingFor: p.lookingFor || '',
              prefAgeMin: p.prefAgeMin || 18,
              prefAgeMax: p.prefAgeMax || 35,
              prefHeight: p.prefHeight || '',
              prefEducation: p.prefEducation || '',
              prefDistrict: p.prefDistrict || '',
              workPreference: p.workPreference || '',
              photos: safePhotos,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    }
    if (user) {
      loadCurrentProfile();
    }
  }, [user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const currentPhotos = Array.isArray(formData.photos) ? formData.photos : [];
      if (currentPhotos.length >= 5) {
        addToast('সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে', 'error');
        return;
      }

      addToast('ছবি অপ্টিমাইজ ও কম্প্রেস করা হচ্ছে...', 'info');

      const newPhotos: string[] = [...currentPhotos];
      for (let i = 0; i < files.length; i++) {
        if (newPhotos.length >= 5) break;
        try {
          const file = files[i];
          if (!file || !file.type.startsWith('image/')) continue;
          const compressedWebP = await compressImageToWebP(file, 800, 800, 0.78);
          if (compressedWebP) {
            newPhotos.push(compressedWebP);
          }
        } catch (err) {
          console.error('Photo compression error:', err);
        }
      }

      setFormData((prev: any) => ({ ...prev, photos: newPhotos }));
      addToast('ছবি সফলভাবে যুক্ত হয়েছে', 'success');
    } catch (err) {
      console.error('Upload handler error:', err);
      addToast('ছবি আপলোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    const current = Array.isArray(formData.photos) ? formData.photos : [];
    const updated = current.filter((_: any, idx: number) => idx !== index);
    setFormData((prev: any) => ({ ...prev, photos: updated }));
  };

  const addHobby = () => {
    if (!hobbyInput.trim()) return;
    const currentHobbies = Array.isArray(formData.hobbies) ? formData.hobbies : [];
    if (currentHobbies.includes(hobbyInput.trim())) return;
    setFormData((prev: any) => ({
      ...prev,
      hobbies: [...currentHobbies, hobbyInput.trim()],
    }));
    setHobbyInput('');
  };

  const removeHobby = (h: string) => {
    const currentHobbies = Array.isArray(formData.hobbies) ? formData.hobbies : [];
    setFormData((prev: any) => ({
      ...prev,
      hobbies: currentHobbies.filter((item: string) => item !== h),
    }));
  };

  const handleSave = async (redirectOnSuccess: boolean = false) => {
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/profiles/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        addToast('বায়োডাটা সফলভাবে সংরক্ষণ করা হয়েছে!', 'success');
        if (redirectOnSuccess && user?.id) {
          router.push(`/profile/${user.id}`);
        }
      } else {
        setError(data.message || data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('সার্ভার ত্রুটি, অনুগ্রহ করে আবার চেষ্টা করুন');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4D7E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3FA] font-serif">
          বায়োডাটা সম্পাদনা ও প্রোফাইল সেটআপ
        </h1>
        <p className="text-xs sm:text-sm text-[#B9AFD1]">
          সুনির্দিষ্ট তথ্য প্রদান করে আপনার ইসলামিক বায়োডাটা আকর্ষণীয় করে তুলুন
        </p>
      </div>

      {/* 4-Step Stepper Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {[
          { num: 1, title: 'শারীরিক ও মৌলিক' },
          { num: 2, title: 'শিক্ষা ও পেশা' },
          { num: 3, title: 'দ্বীন ও লাইফস্টাইল' },
          { num: 4, title: 'পছন্দ ও ছবি' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              step === s.num
                ? 'bg-[#FF4D7E]/15 border-[#FF4D7E] text-[#FF4D7E] shadow-md shadow-[#FF4D7E]/10'
                : step > s.num
                ? 'bg-[#1F1640] border-emerald-500/40 text-emerald-400'
                : 'bg-[#150E2B] border-white/10 text-[#8B7FA8]'
            }`}
          >
            <span className="block text-xs sm:text-sm font-bold">ধাপ {s.num}</span>
            <span className="hidden sm:block text-[11px] mt-0.5 truncate">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-xs font-medium text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Wizard Content Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1F1640]/90 border border-[#FF4D7E]/20 shadow-2xl backdrop-blur-xl">
        
        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#F5F3FA] flex items-center gap-2 pb-3 border-b border-white/10">
              <User className="w-5 h-5 text-[#FF4D7E]" />
              <span>ধাপ ১: শারীরিক ও মৌলিক তথ্য</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  উচ্চতা (সেমি বা ফুট-ইঞ্চি)
                </label>
                <select
                  value={formData.heightCm || ''}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="">উচ্চতা নির্বাচন করুন</option>
                  <option value="147">4&apos;10&quot; (147 সেমি)</option>
                  <option value="150">4&apos;11&quot; (150 সেমি)</option>
                  <option value="152">5&apos;0&quot; (152 সেমি)</option>
                  <option value="155">5&apos;1&quot; (155 সেমি)</option>
                  <option value="157">5&apos;2&quot; (157 সেমি)</option>
                  <option value="160">5&apos;3&quot; (160 সেমি)</option>
                  <option value="163">5&apos;4&quot; (163 সেমি)</option>
                  <option value="165">5&apos;5&quot; (165 সেমি)</option>
                  <option value="168">5&apos;6&quot; (168 সেমি)</option>
                  <option value="170">5&apos;7&quot; (170 সেমি)</option>
                  <option value="173">5&apos;8&quot; (173 সেমি)</option>
                  <option value="175">5&apos;9&quot; (175 সেমি)</option>
                  <option value="178">5&apos;10&quot; (178 সেমি)</option>
                  <option value="180">5&apos;11&quot; (180 সেমি)</option>
                  <option value="183">6&apos;0&quot; (183 সেমি)</option>
                  <option value="185">6&apos;1&quot; (185 সেমি)</option>
                  <option value="188">6&apos;2&quot; (188 সেমি)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  ওজন (কেজি)
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 65"
                  value={formData.weightKg || ''}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  বর্তমান জেলা
                </label>
                <select
                  value={formData.district || ''}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="">জেলা নির্বাচন করুন</option>
                  {BD_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  বৈবাহিক অবস্থা
                </label>
                <select
                  value={formData.maritalStatus || 'Never Married'}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="Never Married">অবিবাহিত</option>
                  <option value="Divorced">ডিভোর্সড</option>
                  <option value="Widowed">বিধবা / বিপত্নীক</option>
                  <option value="Married - Seeking Another Wife">বিবাহিত (দ্বিতীয় বিবাহে আগ্রহী)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  ধর্ম
                </label>
                <select
                  value={formData.religion || 'Islam'}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="Islam">ইসলাম</option>
                  <option value="Hindu">হিন্দু</option>
                  <option value="Other">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  সন্তান বিবরণ
                </label>
                <select
                  value={formData.children || 'No children'}
                  onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="No children">সন্তান নেই</option>
                  <option value="1 child">১ সন্তান</option>
                  <option value="2+ children">২ বা ততোধিক সন্তান</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  ভাইয়ের সংখ্যা
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.brothers ?? 0}
                  onChange={(e) => setFormData({ ...formData, brothers: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  বোনের সংখ্যা
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sisters ?? 0}
                  onChange={(e) => setFormData({ ...formData, sisters: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#F5F3FA] flex items-center gap-2 pb-3 border-b border-white/10">
              <GraduationCap className="w-5 h-5 text-[#FF4D7E]" />
              <span>ধাপ ২: শিক্ষাগত ও পেশাগত বিবরণ</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  সর্বোচ্চ শিক্ষাগত যোগ্যতা
                </label>
                <select
                  value={formData.education || ''}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="">শিক্ষা নির্বাচন করুন</option>
                  <option value="Primary">প্রাথমিক</option>
                  <option value="Secondary">মাধ্যমিক</option>
                  <option value="SSC">এসএসসি (SSC)</option>
                  <option value="HSC">এইচএসসি (HSC)</option>
                  <option value="Honours">অনার্স / স্নাতক / ডিগ্রি</option>
                  <option value="Masters">মাস্টার্স / স্নাতকোত্তর</option>
                  <option value="PhD">পিএইচডি / ডক্টরেট</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  বিষয় / বিভাগ (Subject/Field)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: কম্পিউটার সায়েন্স, একাউন্টিং, ইসলামিক স্টাডিজ"
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  পেশা / কর্মক্ষেত্র
                </label>
                <input
                  type="text"
                  placeholder="যেমন: সফটওয়্যার ইঞ্জিনিয়ার, শিক্ষক, ব্যবসায়ী, সরকারি চাকরি"
                  value={formData.occupation || ''}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  মাসিক আনুমানিক আয় (টাকা)
                </label>
                <select
                  value={formData.income || ''}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="">আয় নির্বাচন করুন</option>
                  <option value="৳ ২০,০০০ - ৩৫,০০০">৳ ২০,০০০ - ৩৫,০০০</option>
                  <option value="৳ ৩৫,০০০ - ৫০,০০০">৳ ৩৫,০০০ - ৫০,০০০</option>
                  <option value="৳ ৫০,০০০ - ৮০,০০০">৳ ৫০,০০০ - ৮০,০০০</option>
                  <option value="৳ ৮০,০০০ - ১,২০,০০০">৳ ৮০,০০০ - ১,২০,০০০</option>
                  <option value="৳ ১,২০,০০০+">৳ ১,২০,০০০+</option>
                  <option value="ব্যক্তিগত / আলোচনা সাপেক্ষ">ব্যক্তিগত / আলোচনা সাপেক্ষ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  পিতার পেশা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ব্যবসায়ী, অবসরপ্রাপ্ত কর্মকর্তা, শিক্ষক"
                  value={formData.fatherOccupation || ''}
                  onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  মাতার পেশা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: গৃহিণী, শিক্ষিকা"
                  value={formData.motherOccupation || ''}
                  onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#F5F3FA] flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="text-[#FF4D7E]">🕌</span>
              <span>ধাপ ৩: ধর্মীয় পালন ও লাইফস্টাইল</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  নামাজ আদায়ের অভ্যাস
                </label>
                <select
                  value={formData.prayerFrequency || '5 times a day'}
                  onChange={(e) => setFormData({ ...formData, prayerFrequency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="5 times a day">দৈনিক ৫ ওয়াক্ত</option>
                  <option value="4 times a day">দৈনিক ৪ ওয়াক্ত</option>
                  <option value="3 times a day">দৈনিক ৩ ওয়াক্ত</option>
                  <option value="Usually">মাঝে মাঝে / জুমুআ</option>
                  <option value="Non-Religious">নিয়মিত নন</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  পর্দা / হিজাব / নিকাব (নারীদের জন্য)
                </label>
                <select
                  value={formData.hijabNiqab || 'Wears Hijab'}
                  onChange={(e) => setFormData({ ...formData, hijabNiqab: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="Wears Hijab">হিজাব পরেন</option>
                  <option value="Wears Hijab & Niqab">হিজাব ও নিকাব পরেন</option>
                  <option value="Does not currently wear Hijab">বর্তমানে হিজাব পরেন না</option>
                  <option value="Undecided / Open to discussion">আলোচনা সাপেক্ষ</option>
                  <option value="N/A">প্রযোজ্য নয় (পুরুষ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  ধূমপান অভ্যাস
                </label>
                <select
                  value={formData.smoking || 'No'}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="No">না (অধূমপায়ী)</option>
                  <option value="Occasionally">মাঝে মাঝে</option>
                  <option value="Yes">হ্যাঁ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  পারিবারিক অবস্থান
                </label>
                <select
                  value={formData.familyStatus || 'Middle class'}
                  onChange={(e) => setFormData({ ...formData, familyStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                >
                  <option value="Middle class">মধ্যবিত্ত</option>
                  <option value="Upper middle class">উচ্চ মধ্যবিত্ত</option>
                  <option value="Well-established">উচ্চবিত্ত / প্রতিষ্ঠিত</option>
                  <option value="Lower class">নিম্নবিত্ত</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  শখ ও পছন্দ (Hobbies)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="যেমন: বই পড়া, ভ্রমণ, কুরআন তিলাওয়াত, রান্না"
                    value={hobbyInput}
                    onChange={(e) => setHobbyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHobby();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                  />
                  <button
                    type="button"
                    onClick={addHobby}
                    className="px-4 py-2 rounded-xl bg-[#FF4D7E] hover:bg-[#E63465] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    যুক্ত করুন
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(formData.hobbies) ? formData.hobbies : []).map((h: string) => (
                    <span
                      key={h}
                      className="px-3 py-1 rounded-full bg-[#331A5C] text-[#F5F3FA] text-xs border border-white/10 flex items-center gap-1.5"
                    >
                      <span>{h}</span>
                      <button
                        type="button"
                        onClick={() => removeHobby(h)}
                        className="text-[#8B7FA8] hover:text-rose-400"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#F5F3FA] flex items-center gap-2 pb-3 border-b border-white/10">
              <Sparkles className="w-5 h-5 text-[#FF4D7E]" />
              <span>ধাপ ৪: পরিচিতি, জীবনসঙ্গী পছন্দ ও ছবি আপলোড</span>
            </h2>

            {/* Photo Uploader with WebP Compression */}
            <div className="p-4 rounded-2xl bg-[#150E2B]/70 border border-[#FF4D7E]/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F5F3FA] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#FF4D7E]" />
                    প্রোফাইল ছবি যুক্ত করুন (সর্বোচ্চ ৫টি)
                  </span>
                  <p className="text-[11px] text-[#8B7FA8] mt-0.5">
                    ছবি স্বয়ংক্রিয়ভাবে হাই-কোয়ালিটি WebP ফরম্যাটে অপ্টিমাইজ হবে
                  </p>
                </div>
                <label className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white cursor-pointer flex items-center gap-1.5 transition-all">
                  <Plus className="w-4 h-4" />
                  ছবি আপলোড
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Photo Preview Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {(Array.isArray(formData.photos) ? formData.photos : []).map((ph: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#FF4D7E]/30 group"
                  >
                    <ImageWithFallback
                      src={typeof ph === 'string' ? ph : ''}
                      alt={`photo-${idx}`}
                      fallbackType="thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-900/90 text-rose-200 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FF4D7E] text-white z-20">
                        মূল ছবি
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Introduction & Bio */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  সংক্ষিপ্ত পরিচিতি (এক নজরে আপনার পরিচয়)
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: আমি ধার্মিক, সৎ ও অমায়িক স্বভাবের একজন মানুষ..."
                  value={formData.introduction || ''}
                  onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                  যেমন জীবনসঙ্গী প্রত্যাশা করেন (সঙ্গীর গুণাবলী)
                </label>
                <textarea
                  rows={3}
                  placeholder="যেমন: পাত্রী/পাত্রকে দীনদার, পাঁচ ওয়াক্ত নামাজী ও পারিবারিক মূল্যবোধ সম্পন্ন হতে হবে..."
                  value={formData.lookingFor || ''}
                  onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                />
              </div>

              {/* Partner Range Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                    প্রত্যাশিত বয়স সীমা ({formData.prefAgeMin ?? 18} - {formData.prefAgeMax ?? 35} বছর)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.prefAgeMin ?? 18}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setFormData((prev: any) => ({ ...prev, prefAgeMin: isNaN(val) ? '' : val }));
                      }}
                      className="px-3 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-center text-[#F5F3FA]"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={formData.prefAgeMax ?? 35}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setFormData((prev: any) => ({ ...prev, prefAgeMax: isNaN(val) ? '' : val }));
                      }}
                      className="px-3 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-center text-[#F5F3FA]"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#B9AFD1] mb-1.5">
                    প্রত্যাশিত জেলা
                  </label>
                  <select
                    value={formData.prefDistrict || ''}
                    onChange={(e) => setFormData({ ...formData, prefDistrict: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#150E2B] border border-white/10 text-[#F5F3FA] text-xs focus:border-[#FF4D7E] outline-none"
                  >
                    <option value="">যেকোনো জেলা</option>
                    {BD_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] border border-white/10 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              পূর্ববর্তী ধাপ
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] border border-white/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              সংরক্ষণ
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#FF4D7E] hover:bg-[#E63465] text-white flex items-center gap-1.5 shadow-md shadow-[#FF4D7E]/20 transition-all cursor-pointer"
              >
                পরবর্তী ধাপ
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF4D7E] to-[#E63465] hover:from-[#E63465] hover:to-[#D12356] text-white flex items-center gap-1.5 shadow-lg shadow-[#FF4D7E]/25 cursor-pointer"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    সম্পূর্ণ করে প্রোফাইল দেখুন
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
