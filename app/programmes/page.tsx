import Link from "next/link";
import { programmes } from "@/data/programmes";

export default function ProgrammesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Programmes</h1>
        <p className="mt-2 text-sm text-gray-600">
          Explore our premium corporate training programmes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {programmes.map((programme) => (
          <article key={programme.id} className="rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">{programme.title}</h2>
            <p className="mt-3 text-sm text-gray-600">{programme.summary}</p>

            <div className="mt-6">
              <Link
                href={`/programmes/${programme.slug}`}
                className="inline-flex rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
              >
                View Program
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
