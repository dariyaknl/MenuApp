import React from 'react';
import { ArrowLeft, Heart, MapPin } from 'lucide-react';
import { DormEatsLogo } from './DormEatsLogo';
import { StudentProfile } from '../types';

interface TopBarProps {
  sectionLabel: string;
  profile: StudentProfile;
  onAvatarClick: () => void;
  showBack?: boolean;
  onBack?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  sectionLabel,
  profile,
  onAvatarClick,
  showBack = false,
  onBack,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#ECEAF6] px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#16142A] hover:bg-[#F3F1FC] active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : null}

        <DormEatsLogo size="sm" />

        {showBack ? (
          <div className="min-w-0">
            <h1 className="text-[16px] font-bold text-[#16142A] leading-tight truncate">
              {sectionLabel}
            </h1>
          </div>
        ) : (
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold tracking-tight text-[#16142A]">
                DormEats
              </span>
              <span className="text-[#3F32E5] text-xs font-bold">•</span>
              <span className="text-[12px] font-medium text-[#6C6A82] truncate">
                {sectionLabel}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#6C6A82] truncate">
              <MapPin className="w-3 h-3 text-[#3F32E5] shrink-0" />
              <span className="truncate">
                {profile.universityShort} • {profile.dormShort}, Bishkek
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {typeof isFavorite === 'boolean' && onToggleFavorite ? (
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition active:scale-95 ${
              isFavorite
                ? 'bg-[#FFF0EC] border-[#FCD5C9] text-[#F55A31]'
                : 'bg-[#F6F5FA] border-[#EAE6F8] text-[#6C6A82] hover:text-[#F55A31]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#F55A31]' : ''}`} />
          </button>
        ) : null}

        <button
          type="button"
          onClick={onAvatarClick}
          aria-label="Open student profile"
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#E3DFFA] shadow-xs active:scale-95 transition shrink-0"
        >
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
