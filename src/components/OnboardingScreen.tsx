import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  AtSign,
  Building2,
  CheckCircle2,
  ChevronDown,
  Flame,
  GraduationCap,
  IdCard,
  Landmark,
  Lock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UNIVERSITIES } from '../data/mockData';
import { StudentProfile } from '../types';
import { DormEatsLogo } from './DormEatsLogo';

interface OnboardingScreenProps {
  initialProfile: StudentProfile;
  onCompleteVerification: (updates: Partial<StudentProfile>) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  initialProfile,
  onCompleteVerification,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [step, setStep] = useState<1 | 2>(1);
  const [universityId, setUniversityId] = useState(initialProfile.universityId || 'aiu');
  const selectedUni = useMemo(
    () => UNIVERSITIES.find((u) => u.id === universityId) || UNIVERSITIES[0],
    [universityId]
  );

  const [dormId, setDormId] = useState(selectedUni.dorms[0].id);
  const selectedDorm = useMemo(
    () => selectedUni.dorms.find((d) => d.id === dormId) || selectedUni.dorms[0],
    [selectedUni, dormId]
  );

  const [emailOrId, setEmailOrId] = useState(initialProfile.email || 'alex.k@alatoo.edu.kg');
  const [fullName, setFullName] = useState(initialProfile.fullName || 'Alex Kim');
  const [roomNumber, setRoomNumber] = useState(initialProfile.roomNumber || 'Room 314');
  const [otpCode, setOtpCode] = useState('4829');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const isEmailOrIdValid = useMemo(() => {
    const trimmed = emailOrId.trim();
    if (trimmed.length < 4) return false;
    if (trimmed.includes('@')) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    }
    return /^[A-Za-z0-9#-]{5,}$/.test(trimmed);
  }, [emailOrId]);

  const handleUniversityChange = (nextUniId: string) => {
    setUniversityId(nextUniId);
    const nextUni = UNIVERSITIES.find((u) => u.id === nextUniId) || UNIVERSITIES[0];
    setDormId(nextUni.dorms[0].id);
    if (emailOrId === 'alex.k@alatoo.edu.kg' || emailOrId.includes('@')) {
      const localPart = emailOrId.split('@')[0] || 'alex.k';
      setEmailOrId(`${localPart}@${nextUni.domain}`);
    }
    setErrorMsg('');
  };

  const handleStepOneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailOrIdValid) {
      setErrorMsg('Please enter a valid .edu.kg institutional email or student ID (min 5 chars).');
      return;
    }
    setErrorMsg('');
    if (mode === 'login') {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        const derivedFirst = fullName.trim().split(' ')[0] || 'Alex';
        onCompleteVerification({
          universityId: selectedUni.id,
          universityName: selectedUni.name,
          universityShort: selectedUni.shortName,
          dormitory: selectedDorm.name,
          dormShort: selectedDorm.shortName,
          dormMealSpot: selectedDorm.mealSpot,
          email: emailOrId.trim(),
          fullName: fullName.trim() || 'Alex Kim',
          firstName: derivedFirst,
          roomNumber: roomNumber.trim() || 'Room 314',
          verified: true,
        });
      }, 450);
      return;
    }
    setStep(2);
  };

  const handleStepTwoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name for cafeteria pickup labels.');
      return;
    }
    if (otpCode.trim().length < 4) {
      setErrorMsg('Enter the 4-digit campus verification code (e.g. 4829).');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const cleanName = fullName.trim();
      const firstName = cleanName.split(' ')[0] || 'Alex';
      onCompleteVerification({
        universityId: selectedUni.id,
        universityName: selectedUni.name,
        universityShort: selectedUni.shortName,
        dormitory: selectedDorm.name,
        dormShort: selectedDorm.shortName,
        dormMealSpot: selectedDorm.mealSpot,
        email: emailOrId.trim(),
        fullName: cleanName,
        firstName,
        roomNumber: roomNumber.trim() || 'Room 314',
        studentNumber: `${selectedUni.id.toUpperCase()} #2024-${otpCode.trim().slice(0, 4)}`,
        verified: true,
      });
    }, 550);
  };

  return (
    <div className="min-h-screen bg-[#F5F4FA] px-4 pt-3 pb-6 flex flex-col">
      {/* Top Brand Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <DormEatsLogo size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[19px] font-extrabold tracking-tight text-[#16142A]">
                Dorm<span className="text-[#F55A31]">Eats</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#FFEAE4] text-[#F55A31] text-[10px] font-bold">
                KG
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6C6A82]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>Bishkek Campuses Live</span>
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-[#EAE7FA] text-[#3F32E5] text-[11px] font-bold flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>2024–25</span>
        </div>
      </div>

      {/* Hero Tray Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-md mb-4 bg-[#262038]">
        <img
          src="/images/hero_tray.jpg"
          alt="Fresh hot lunch tray ready right when class ends"
          className="w-full h-[168px] object-cover block"
        />
      </div>

      {/* Hero Headline */}
      <div className="mb-3.5">
        <h1 className="text-[25px] font-extrabold tracking-tight text-[#16142A] leading-[1.18] mb-1.5">
          Good food, right at your dorm.
        </h1>
        <p className="text-[13px] text-[#6C6A82] leading-[1.45]">
          Discover your cafeteria menu, plan your daily meals and order student-rate favorites across Bishkek.
        </p>
      </div>

      {/* Feature Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        <div className="shrink-0 bg-white border border-[#EAE6F8] rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-2xs">
          <span className="w-5 h-5 rounded-full bg-[#FFF0EC] flex items-center justify-center">
            <Zap className="w-3 h-3 text-[#F55A31]" />
          </span>
          <span className="text-[11.5px] font-semibold text-[#16142A]">
            Instant Cafeteria Pickup
          </span>
        </div>
        <div className="shrink-0 bg-white border border-[#EAE6F8] rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-2xs">
          <span className="px-1.5 py-0.5 rounded-full bg-[#EAE7FA] text-[#3F32E5] text-[9px] font-extrabold">
            COM
          </span>
          <span className="text-[11.5px] font-semibold text-[#16142A]">
            Student Prices in KGS
          </span>
        </div>
      </div>

      {/* Campus Verification Card */}
      <div className="bg-white rounded-3xl border border-[#ECEAF6] shadow-[0_8px_28px_rgba(34,28,70,0.06)] p-4.5 mb-4">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <IdCard className="w-4.5 h-4.5 text-[#3F32E5]" />
            <h2 className="text-[15px] font-bold text-[#16142A]">
              {mode === 'login' ? 'Student Portal Login' : 'Campus Verification'}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#F3F1FC] text-[#6C6A82] text-[10.5px] font-semibold">
            {mode === 'login' ? 'Quick Sign-In' : `Step ${step} of 2`}
          </span>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStepOneSubmit} className="space-y-3">
            <div>
              <label className="block text-[11.5px] font-semibold text-[#4A4863] mb-1.5">
                Select University
              </label>
              <div className="relative">
                <Landmark className="w-4 h-4 text-[#6C6A82] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={universityId}
                  onChange={(e) => handleUniversityChange(e.target.value)}
                  className="w-full appearance-none bg-[#F4F2FC] border border-transparent focus:border-[#3F32E5] focus:bg-white rounded-2xl pl-10 pr-9 py-3 text-[13px] font-semibold text-[#16142A] outline-none transition"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#6C6A82] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {mode === 'register' ? (
              <div>
                <label className="block text-[11.5px] font-semibold text-[#4A4863] mb-1.5">
                  Dormitory & Residence Wing
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#6C6A82] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={dormId}
                    onChange={(e) => setDormId(e.target.value)}
                    className="w-full appearance-none bg-[#F4F2FC] border border-transparent focus:border-[#3F32E5] focus:bg-white rounded-2xl pl-10 pr-9 py-3 text-[13px] font-semibold text-[#16142A] outline-none transition"
                  >
                    {selectedUni.dorms.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#6C6A82] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            ) : null}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11.5px] font-semibold text-[#4A4863]">
                  Institutional Email or Student ID
                </label>
                <span className="text-[10.5px] font-semibold text-[#3F32E5]">
                  .edu.kg preferred
                </span>
              </div>
              <div className="relative">
                <AtSign className="w-4 h-4 text-[#6C6A82] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={emailOrId}
                  onChange={(e) => {
                    setEmailOrId(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={`alex.k@${selectedUni.domain}`}
                  className="w-full bg-[#F4F2FC] border border-transparent focus:border-[#3F32E5] focus:bg-white rounded-2xl pl-10 pr-10 py-3 text-[13px] font-semibold text-[#16142A] outline-none transition"
                />
                {isEmailOrIdValid ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981] absolute right-3.5 top-1/2 -translate-y-1/2" />
                ) : null}
              </div>
            </div>

            {errorMsg ? (
              <p className="text-[11.5px] font-medium text-[#E11D48] bg-[#FFF1F2] px-3 py-2 rounded-xl">
                {errorMsg}
              </p>
            ) : null}

            {/* Welcome Bonus Callout */}
            <div className="bg-[#F4F2FC] rounded-2xl p-3 flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-[#F55A31] shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-[#4A4863] leading-snug">
                <span className="font-bold text-[#16142A]">Welcome bonus:</span> First lunch pre-order includes free Samarkand tea or Compote at {selectedDorm.shortName} dining counter!
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#3F32E5] hover:bg-[#3528D1] active:scale-[0.99] text-white font-bold text-[14px] py-3.5 rounded-2xl shadow-[0_6px_18px_rgba(63,50,229,0.28)] flex items-center justify-center gap-2 transition disabled:opacity-70"
            >
              <span>
                {isVerifying
                  ? 'Connecting to Student Portal...'
                  : mode === 'login'
                  ? 'Log In & Open Menu'
                  : 'Verify Student Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleStepTwoSubmit} className="space-y-3">
            <div className="bg-[#E6F7EF] border border-[#BDE9D3] rounded-2xl p-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#138A53] shrink-0" />
              <div className="text-[11.5px] text-[#115E3B] leading-snug">
                Verification code sent to <span className="font-bold">{emailOrId}</span>. Use{' '}
                <span className="font-bold">4829</span> for instant campus simulation.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11.5px] font-semibold text-[#4A4863] mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Kim"
                  className="w-full bg-[#F4F2FC] border border-transparent focus:border-[#3F32E5] focus:bg-white rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#16142A] outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-[#4A4863] mb-1">
                  Dorm Room
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Room 314"
                  className="w-full bg-[#F4F2FC] border border-transparent focus:border-[#3F32E5] focus:bg-white rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#16142A] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11.5px] font-semibold text-[#4A4863] mb-1">
                4-Digit Portal Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-[#F4F2FC] border border-transparent focus:border-[#3F32E5] focus:bg-white rounded-2xl px-4 py-3 text-center tracking-[0.4em] text-[16px] font-extrabold text-[#3F32E5] outline-none tabular-nums"
              />
            </div>

            {errorMsg ? (
              <p className="text-[11.5px] font-medium text-[#E11D48] bg-[#FFF1F2] px-3 py-2 rounded-xl">
                {errorMsg}
              </p>
            ) : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMsg('');
                }}
                className="px-4 py-3.5 rounded-2xl bg-[#F4F2FC] text-[#4A4863] font-bold text-[13px] hover:bg-[#EAE6F8] transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 bg-[#3F32E5] hover:bg-[#3528D1] active:scale-[0.99] text-white font-bold text-[14px] py-3.5 rounded-2xl shadow-[0_6px_18px_rgba(63,50,229,0.28)] flex items-center justify-center gap-2 transition"
              >
                <span>{isVerifying ? 'Activating Pass...' : 'Confirm & Enter Cafeteria'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        <div className="mt-3.5 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register');
              setStep(1);
              setErrorMsg('');
            }}
            className="text-[12px] font-medium text-[#6C6A82]"
          >
            {mode === 'register' ? (
              <>
                Already have an account?{' '}
                <span className="text-[#3F32E5] font-bold underline underline-offset-2">
                  Log in
                </span>
              </>
            ) : (
              <>
                New to DormEats?{' '}
                <span className="text-[#3F32E5] font-bold underline underline-offset-2">
                  Verify student account
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Trust Badge */}
      <div className="mt-auto text-center space-y-2 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ECE9F9] text-[#4A4863] text-[11px] font-semibold">
          <Lock className="w-3 h-3 text-[#138A53]" />
          <span>Secured with Bishkek University Student Portal SSO</span>
        </div>
        <p className="text-[10.5px] text-[#7A7891] font-medium">
          AIU • AUCA • KRSU • KNU &nbsp;•&nbsp; Pricing in Kyrgyz Som (KGS)
        </p>
      </div>
    </div>
  );
};
