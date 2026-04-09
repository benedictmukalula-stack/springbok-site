import Link from "next/link";
import { notFound } from "next/navigation";
import { programmes } from "@/data/programmes";
import ProgrammePricingCalculator from "@/components/programmes/programme-pricing-calculator";

export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const programme = programmes.find((item) => item.slug === slug);

  if (!programme) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <Link href="/programmes" className="text-sm text-gray-600 hover:text-black">
          ← Back to programmes
        </Link>
        <h1 className="mt-3 text-3xl font-semibold">{programme.title}</h1>
        <p className="mt-3 max-w-3xl text-gray-600">{programme.summary}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Programme Overview</h2>
          <p className="mt-4 text-gray-700">{programme.description}</p>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">Core Coverage</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Practical corporate learning outcomes</li>
              <li>• Team capability and performance improvement</li>
              <li>• Applied frameworks and guided facilitation</li>
              <li>• Delivery built for organisational impact</li>
            </ul>
          </div>
        </section>

        <aside>
          <ProgrammePricingCalculator programme={programme} />
        </aside>
      </div>
    </main>
  );
}
