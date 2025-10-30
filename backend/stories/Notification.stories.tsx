import Notification from "@/components/Notification";

const meta = {
  title: "Notification",
  component: Notification,
};

export default meta;

export const Default = {
  args: {
    message: "We’ve resent the link to your email!",
    onClose: () => {},
  },
};
