import { UserRound, LockKeyhole } from "lucide-react-native";

export const inputVariants = {
  username: {
    type: "username",
    icon: UserRound,
    placeholder: "Enter your username",
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
