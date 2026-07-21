'use client';

import ScrollAnimation from './ScrollAnimation';
import NewsletterSubscribeForm from './NewsletterSubscribeForm';

export default function Newsletter() {
    return (
        <section className="max-w-7xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-8">
            <ScrollAnimation direction="fade" className="text-center">
                <h2 className="text-3xl md:text-4xl text-[#7F1D1D] font-serif mb-4 md:mb-6">Join the luxe List</h2>
                <p className="text-sm md:text-base mb-6 md:mb-8 px-4">Be the first to hear about seasonal collection, scalp care tips, and exclusive studio openings.</p>
                <NewsletterSubscribeForm />
            </ScrollAnimation>
        </section>
    );
}

