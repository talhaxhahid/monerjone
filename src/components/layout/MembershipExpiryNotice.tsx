'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import UpgradeModal from '@/components/ui/UpgradeModal';

const PLAN_LABEL_BN: Record<string, string> = {
  Gold: 'গোল্ড',
  Platinum: 'প্লাটিনাম',
};

// Membership auto-downgrades to Free after 30 days (see src/lib/auth.ts).
// This tells the user WHY, instead of them silently losing premium features
// with no explanation.
export default function MembershipExpiryNotice() {
  const { expiredPlanNotice, clearExpiredPlanNotice } = useAuth();

  if (!expiredPlanNotice) return null;

  const planLabel = PLAN_LABEL_BN[expiredPlanNotice] || expiredPlanNotice;

  return (
    <UpgradeModal
      isOpen={!!expiredPlanNotice}
      onClose={clearExpiredPlanNotice}
      title="আপনার মেম্বারশিপের মেয়াদ শেষ হয়ে গেছে"
      description={`আপনার ৩০ দিনের ${planLabel} মেম্বারশিপের মেয়াদ শেষ হয়েছে। অসীম মেসেজ ও প্রিমিয়াম ফিচার চালিয়ে যেতে আবার আপগ্রেড করুন।`}
    />
  );
}
