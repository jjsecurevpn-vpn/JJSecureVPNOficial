/**
 * @file BasicIcons.tsx
 * @description Iconos básicos usando Lucide React para reemplazar los iconos animados
 */

import {
  Bot,
  Check,
  Clock,
  Download,
  Upload,
  Menu,
  Crown,
  Coffee,
  BookOpen,
  MessageCircle,
  Play,
  Server,
  Headphones,
  Heart,
  Mail,
  Zap,
  Shield,
  ChevronUp,
  ChevronDown,
  Info
} from 'lucide-react';

// Interfaz común para todos los iconos
interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  size?: number;
}

// Mapeo de iconos animados a iconos básicos de Lucide
export const BotIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Bot size={size} className={className} {...props} />
);

export const CheckIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Check size={size} className={className} {...props} />
);

export const TimerIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Clock size={size} className={className} {...props} />
);

export const DownloadIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Download size={size} className={className} {...props} />
);

export const UploadIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Upload size={size} className={className} {...props} />
);

export const MenuIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Menu size={size} className={className} {...props} />
);

export const PremiumIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Crown size={size} className={className} {...props} />
);

export const CoffeeIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Coffee size={size} className={className} {...props} />
);

export const TutorialIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <BookOpen size={size} className={className} {...props} />
);

export const WhatsAppIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <MessageCircle size={size} className={className} {...props} />
);

export const PlayAutoIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Play size={size} className={className} {...props} />
);

export const ServerPremiumIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Server size={size} className={className} {...props} />
);

export const SupportIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Headphones size={size} className={className} {...props} />
);

export const DonationIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Heart size={size} className={className} {...props} />
);

export const EmailIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Mail size={size} className={className} {...props} />
);

export const SpeedIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Zap size={size} className={className} {...props} />
);

export const SecurityIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Shield size={size} className={className} {...props} />
);

export const ArrowUpIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <ChevronUp size={size} className={className} {...props} />
);

export const ChevronDownIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <ChevronDown size={size} className={className} {...props} />
);

export const InfoIcon = ({ size = 24, className = "", ...props }: IconProps) => (
  <Info size={size} className={className} {...props} />
);
