import { UserRound, LockKeyhole } from "lucide-react-native";

export const inputVariants = {
  username: {
    type: "username",
    icon: UserRound,
    placeholder: "Aktoq b'i q'anwom ",
  },
  password: {
    icon: LockKeyhole,
    placeholder: "Aktoq latz'b'al (contraseña)",
  },
  text: {
    type: "text",
    placeholder: "Enter text",
  },
};
