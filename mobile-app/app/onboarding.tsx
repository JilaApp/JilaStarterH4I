import BuildProfile from "@/onboarding/build-profile";
import Welcome from "@/onboarding/welcome";
import { useState } from "react";

export default function Onboarding() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    selectedLanguage: null,
    ttsEnabled: false,
    selectedDropdown: null,
    selectedCity: null,
    communityOrg: "",
    areaOrg: null,
  });

  if (showWelcome) {
    return <Welcome onGetStarted={() => setShowWelcome(false)} />;
  }

  return <BuildProfile formData={formData} setFormData={setFormData} />;
}
