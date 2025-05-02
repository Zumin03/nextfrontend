import './globals.css';
import type { Metadata } from 'next';
import SiteWrapper from './SiteWrapper';

export const metadata: Metadata = {
    title: 'Todo Manager',
    description: 'A fullstack app with Next.js and NestJS',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
        <SiteWrapper>{children}</SiteWrapper>
        </body>
        </html>
    );
}