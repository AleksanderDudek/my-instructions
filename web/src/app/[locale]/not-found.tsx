import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24">
      <h1 className="mb-3 text-3xl">404</h1>
      <p className="mb-6 max-w-[62ch] text-muted">This page does not exist.</p>
      <Link href="/" className="label-caps hover:text-ink">
        ← Home
      </Link>
    </div>
  );
}
