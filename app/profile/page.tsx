'use client';

export default function ProfileIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif text-[#3A241C] mb-2">Profile</h1>
      <p className="text-[#454545]">View and manage your salon bookings.</p>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Click on your profile avatar in the top right corner and select "My Bookings" to view your appointments.
        </p>
      </div>
    </div>
  );
}

