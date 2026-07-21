import type { Metadata } from 'next';
import './globals.css';
import { WishlistProvider } from '@/contexts/WishlistContext';
import ClerkProviderWrapper from '@/app/ClerkProviderWrapper';
import LayoutShell from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: "Fave's Touch - Hair Braiding Salon",
  description:
    "Experience premium hair braiding services at Fave's Touch Salon. Book your appointment today for elegant, professional braiding styles.",
  openGraph: {
    title: "Fave's Touch - Hair Braiding Salon",
    description:
      "Experience premium hair braiding services at Fave's Touch Salon. Book your appointment today.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WishlistProvider>
          <ClerkProviderWrapper>
            <LayoutShell>{children}</LayoutShell>
          </ClerkProviderWrapper>
        </WishlistProvider>
      </body>
    </html>
  );
}
