import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Premium Corporate Training
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Knowledge Camp Global
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Premium programme discovery, registration, pricing, cart, checkout, and payment flow.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/programmes"
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            View Programmes
          </Link>
          <Link
            href="/register"
            className="rounded-xl border px-5 py-3 text-sm font-medium"
          >
            Registration
          </Link>
        </div>
      </section>
    </main>
  );
}
