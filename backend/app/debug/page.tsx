"use client";

import { useUser } from "@clerk/nextjs";

export default function DebugPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(
          {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            publicMetadata: user.publicMetadata,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
