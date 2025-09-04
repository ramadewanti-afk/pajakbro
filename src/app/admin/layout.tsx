
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Here you could add a sidebar, header, etc. specific to the admin area */}
      <main className="p-8">{children}</main>
    </div>
  );
}
