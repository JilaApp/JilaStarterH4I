"use client";

import { useState } from "react";
import { Send, Users, UserPlus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useNotification } from "@/hooks/useNotification";
import FormField from "@/components/forms/FormField";
import { EmailInput, TextInput } from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import { useForm, createField } from "@/hooks/useForm";
import { validateEmail, validateRequired } from "@/lib/validators";
import { logger } from "@/lib/logger";

type InviteMode = "existing" | "new";

export default function InviteView() {
  const { showNotification, NotificationContainer } = useNotification();
  const [inviteMode, setInviteMode] = useState<InviteMode>("existing");

  const { fields, setFieldValue, setFieldError, validateAllFields, resetForm } =
    useForm({
      email: createField(""),
      communityName: createField(""),
      selectedCommunityIndex: createField<number | undefined>(undefined),
    });

  const { data: communityOrgs, refetch: refetchCommunityOrgs } =
    trpc.community.getAllCommunityOrgs.useQuery();

  const sendInvitationMutation = trpc.community.sendInvitation.useMutation({
    onSuccess: () => {
      showNotification(`Invite sent to ${fields.email.value}`, "success");
      resetForm();
    },
    onError: (error) => {
      logger.error("[sendInvitation] Failed to send invitation", error);
      showNotification(
        error?.message || "Failed to send invitation. Please try again.",
        "error",
      );
    },
  });

  const sendInvitationWithNewCommunityMutation =
    trpc.community.sendInvitationWithNewCommunity.useMutation({
      onSuccess: () => {
        showNotification(`Invite sent to ${fields.email.value}`, "success");
        resetForm();
        refetchCommunityOrgs();
      },
      onError: (error) => {
        logger.error(
          "[sendInvitationWithNewCommunity] Failed to send invitation",
          error,
        );
        showNotification(
          error?.message || "Failed to send invitation. Please try again.",
          "error",
        );
      },
    });

  const handleSubmit = () => {
    const emailError = validateEmail(fields.email.value);
    if (emailError) {
      setFieldError("email", emailError);
      return;
    }

    if (inviteMode === "existing") {
      if (fields.selectedCommunityIndex.value === undefined) {
        setFieldError("selectedCommunityIndex", "Please select a community");
        return;
      }

      const selectedCommunity =
        communityOrgs?.[fields.selectedCommunityIndex.value];
      if (!selectedCommunity) {
        showNotification("Please select a valid community", "error");
        return;
      }

      sendInvitationMutation.mutate({
        email: fields.email.value,
        communityOrgId: selectedCommunity.id,
      });
    } else {
      const nameError = validateRequired(fields.communityName.value);
      if (nameError) {
        setFieldError("communityName", nameError);
        return;
      }

      sendInvitationWithNewCommunityMutation.mutate({
        email: fields.email.value,
        communityName: fields.communityName.value,
      });
    }
  };

  const isLoading =
    sendInvitationMutation.isPending ||
    sendInvitationWithNewCommunityMutation.isPending;

  const communityOrgNames = communityOrgs?.map((org) => org.name) || [];

  return (
    <div className="flex-1 px-10 py-6 flex flex-col items-center">
      <NotificationContainer />

      <div className="mt-16 mb-6">
        <div className="w-[61px] h-[61px] flex items-center justify-center">
          <Send className="w-12 h-12 text-type-400" strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-type-400 text-center mb-2">
        Invite communities to JILA
      </h1>
      <p className="text-lg text-gray-300 text-center max-w-[603px] mb-8">
        Create and send an invitation link for new communities to sign up for
        JILA.
      </p>

      <div className="flex gap-6 mb-8">
        <button
          onClick={() => setInviteMode("existing")}
          className={`w-[309px] h-[120px] rounded-[10px] border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            inviteMode === "existing"
              ? "border-jila-400 bg-white shadow-[0_0_0_3px_#ffe1e1]"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <Users
            className={`w-6 h-6 ${inviteMode === "existing" ? "text-type-400" : "text-gray-300"}`}
          />
          <span
            className={`font-bold text-lg ${inviteMode === "existing" ? "text-type-400" : "text-gray-300"}`}
          >
            Add to existing community
          </span>
        </button>

        <button
          onClick={() => setInviteMode("new")}
          className={`w-[309px] h-[120px] rounded-[10px] border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            inviteMode === "new"
              ? "border-jila-400 bg-white shadow-[0_0_0_3px_#ffe1e1]"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <UserPlus
            className={`w-6 h-6 ${inviteMode === "new" ? "text-type-400" : "text-gray-300"}`}
          />
          <span
            className={`font-bold text-lg ${inviteMode === "new" ? "text-type-400" : "text-gray-300"}`}
          >
            Create new community
          </span>
        </button>
      </div>

      <div className="flex gap-6 items-start">
        <div className="w-[308px]">
          {inviteMode === "existing" ? (
            <FormField
              title="Community name"
              required
              state={fields.selectedCommunityIndex.state}
              errorString={fields.selectedCommunityIndex.error}
            >
              {() => (
                <Dropdown
                  options={communityOrgNames}
                  value={fields.selectedCommunityIndex.value}
                  onChange={(val) =>
                    setFieldValue("selectedCommunityIndex", val)
                  }
                  placeholder="Select a community"
                  state={fields.selectedCommunityIndex.state}
                />
              )}
            </FormField>
          ) : (
            <FormField
              title="Community name"
              required
              state={fields.communityName.state}
              errorString={fields.communityName.error}
              value={fields.communityName.value}
              onChange={(val) => setFieldValue("communityName", val)}
            >
              {(props) => (
                <TextInput
                  {...props}
                  placeholder="Enter community name"
                  className="w-full h-[60px]"
                />
              )}
            </FormField>
          )}
        </div>

        <div className="w-[631px]">
          <FormField
            title="Email"
            required
            state={fields.email.state}
            errorString={fields.email.error}
            value={fields.email.value}
            onChange={(val) => setFieldValue("email", val)}
          >
            {(props) => (
              <EmailInput
                {...props}
                placeholder="Enter email address"
                className="w-full h-[60px]"
              />
            )}
          </FormField>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-[56px] h-[60px] mt-[34px] rounded-[10px] bg-jila-400 flex items-center justify-center transition-opacity ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 cursor-pointer"
          }`}
        >
          <Send className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
