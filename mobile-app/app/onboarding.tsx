import BuildProfile from "@/onboarding/build-profile";
import Welcome from "@/onboarding/welcome";
import { useState } from "react";

export default function Onboarding() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <Welcome onGetStarted={() => setShowWelcome(false)} />;
  }

  return <BuildProfile />;
}
