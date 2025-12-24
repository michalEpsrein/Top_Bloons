import {
  Cake,
  Heart,
  Star,
  Baby,
  Briefcase,
  Gift,
  Sparkles,
} from "lucide-react";

export const categories = [
  { id: "all", label: "הכל", icon: Sparkles },
  { id: "birthday", label: "ימי הולדת", icon: Cake },
  { id: "wedding", label: "חתונות", icon: Heart },
  { id: "bar_bat_mitzvah", label: "בר/בת מצווה", icon: Star },
  { id: "brit", label: "ברית", icon: Baby },
  { id: "baby_shower", label: "בייבי שאוור", icon: Gift },
  { id: "business", label: "אירועים עסקיים", icon: Briefcase },
  { id: "other", label: "אחר", icon: Sparkles },
];
