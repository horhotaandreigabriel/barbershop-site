import { isAdminAuthenticated } from "@/lib/admin-auth";
import { hasFirebaseRuntimeConfig } from "@/lib/firebase-admin";
import AdminClient from "@/app/admin/admin-client";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <AdminClient initialAuthenticated={authenticated} firebaseReady={hasFirebaseRuntimeConfig} />
    </main>
  );
}
