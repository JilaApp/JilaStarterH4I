import { Mail, LockKeyhole } from "lucide-react-native";

export const inputVariants = {
  email: {
    type: "email",
    icon: Mail,
    placeholder: "Enter your email",
  },
  password: {
    icon: LockKeyhole,
    placeholder: "Enter your password",
  },
  text: {
    type: "text",
    placeholder: "Enter text",
  },
};
