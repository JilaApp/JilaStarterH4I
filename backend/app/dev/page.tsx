"use client";
import Notification from "@/components/Notification";
import DisplayBox from "@/components/DisplayBox";
import PageBackground from "@/components/PageBackground";

function DisplayBoxInnerContent() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-2">Welcome back!</h1>
      <p className="text-gray-600 mb-6">
        Enter your details to get signed into your admin account
      </p>

      <form className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Enter email"
          className="w-full rounded-md border border-gray-300 p-3"
        />
        <input
          type="password"
          placeholder="Enter password"
          className="w-full rounded-md border border-gray-300 p-3"
        />
        <a href="#" className="text-sm text-jila-400 hover:underline">
          Forgot your password?
        </a>
        <button className="w-full rounded-md bg-jila-400 text-white p-3 hover:bg-rose-900">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default function DevPage() {
  return (
    <div>
      <div className="flex flex-col gap-20 p-10">
        <Notification
          message="We’ve resent the link to your email!"
          onClose={() => {}}
        />
        <DisplayBox>
          <DisplayBoxInnerContent />
        </DisplayBox>
        <PageBackground>
          <DisplayBox>
            <DisplayBoxInnerContent />
          </DisplayBox>
        </PageBackground>
      </div>
      <div className="page-title-text">page-title-text</div>
      <div className="components-text">components-text</div>
      <div className="link-text">link-text</div>
      <div className="body1-desktop-semi-text">body1-desktop-semi-text</div>
      <div className="body1-desktop-bold-text">body1-desktop-bold-text</div>

      <div className="bg-cream-300">bg-cream-300</div>
      <div className="bg-jila-400">
        <div className="text-white">bg-jila-400</div>
      </div>
      <div className="bg-jila-300">bg-jila-300</div>
      <div className="bg-orange-400">bg-orange-400</div>
      <div className="bg-orange-300">bg-orange-300</div>
      <div className="bg-yellow-400">bg-yellow-400</div>
      <div className="bg-cream-300">bg-cream-300</div>
      <div className="bg-green-400">bg-green-400</div>
      <div className="bg-teal-400">bg-teal-400</div>
      <div className="bg-teal-300">bg-teal-300</div>
      <div className="bg-error-400">bg-error-400</div>
      <div className="bg-error-300">bg-error-300</div>
      <div className="bg-error-200">bg-error-200</div>
      <div className="bg-type-400">
        <div className="text-white">bg-type-400</div>
      </div>
      <div className="bg-white-400">bg-white-400</div>
      <div className="bg-gray-400">bg-gray-400</div>
      <div className="bg-gray-300">bg-gray-300</div>
      <div className="bg-gray-200">bg-gray-200</div>
    </div>
  );
}
