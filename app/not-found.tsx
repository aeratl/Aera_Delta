import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">404</p>
      <h1 className="text-5xl md:text-7xl font-[200] text-white uppercase tracking-[0.05em] mb-8">
        Not Found.
      </h1>
      <p className="text-zinc-400 mb-12 max-w-sm">
        This page doesn&apos;t exist. Maybe it&apos;s still being built.
      </p>
      <Link
        href="/"
        className="bg-white text-black text-sm font-[500] uppercase tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-zinc-200 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
      >
        Back to Home
      </Link>
    </div>
  )
}
