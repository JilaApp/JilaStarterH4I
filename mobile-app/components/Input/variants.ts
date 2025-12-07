import { UserRound, LockKeyhole } from "lucide-react-native";

export const inputVariants = {
  username: {
    type: "username",
    icon: UserRound,
    placeholder: "Enter username",
  },
  password: {
    icon: LockKeyhole,
    placeholder: "Enter password",
  },
  text: {
    type: "text",
    placeholder: "Enter text",
  },
};
