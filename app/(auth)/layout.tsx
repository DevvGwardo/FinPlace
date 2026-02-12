import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="p-4 md:p-5">
        <Link href="/" className="text-xl font-bold text-text">
          Fin<span className="text-green">Place</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-5 px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
