import type { Avatar as AvatarType } from '../../types';
import {
  BookText,
  Plane,
  Utensils,
  ShoppingBag,
  Car,
  Hotel,
  Camera,
  PartyPopper,
  Briefcase,
  Heart,
  User as UserIcon,
} from 'lucide-react';

const iconMap = {
  book: BookText,
  plane: Plane,
  food: Utensils,
  shopping: ShoppingBag,
  car: Car,
  hotel: Hotel,
  camera: Camera,
  party: PartyPopper,
  briefcase: Briefcase,
  heart: Heart,
} as const;

export type AvatarIconKey = keyof typeof iconMap;

export function Avatar({
  avatar,
  fallback = 'user',
  className,
}: {
  avatar?: AvatarType;
  fallback?: 'user' | 'book';
  className?: string;
}) {
  if (avatar?.kind === 'image') {
    return (
      <img
        src={avatar.dataUrl}
        alt=""
        className={className}
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (avatar?.kind === 'emoji') {
    return (
      <div className={className} aria-hidden="true">
        <span className="text-[22px] leading-none">{avatar.emoji}</span>
      </div>
    );
  }

  if (avatar?.kind === 'icon') {
    const Icon = iconMap[avatar.icon as AvatarIconKey] ?? (fallback === 'book' ? BookText : UserIcon);
    return (
      <div className={className} aria-hidden="true">
        <Icon size={22} />
      </div>
    );
  }

  const FallbackIcon = fallback === 'book' ? BookText : UserIcon;
  return (
    <div className={className} aria-hidden="true">
      <FallbackIcon size={22} />
    </div>
  );
}

export const avatarIconOptions: { key: AvatarIconKey; label: string; Icon: typeof BookText }[] = [
  { key: 'book', label: '帳本', Icon: BookText },
  { key: 'plane', label: '旅行', Icon: Plane },
  { key: 'food', label: '美食', Icon: Utensils },
  { key: 'shopping', label: '購物', Icon: ShoppingBag },
  { key: 'car', label: '交通', Icon: Car },
  { key: 'hotel', label: '住宿', Icon: Hotel },
  { key: 'camera', label: '拍照', Icon: Camera },
  { key: 'party', label: '派對', Icon: PartyPopper },
  { key: 'briefcase', label: '工作', Icon: Briefcase },
  { key: 'heart', label: '喜愛', Icon: Heart },
];

