import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F1EC]">
      <div className="text-center">
        <h2 className="text-4xl font-serif text-[#3A241C] mb-4">Page Not Found</h2>
        <p className="text-[#454545] mb-8">The page you are looking for does not exist.</p>
        <Link href="/">
          <button className="bg-[#8A4A32] text-white px-6 py-2 rounded hover:bg-[#6A3A22] transition">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}
