export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Registration</h1>
      <p className="mt-2 text-sm text-gray-600">
        Clean registration page placeholder.
      </p>

      <div className="mt-8 rounded-2xl border p-6">
        <form className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Full Name</label>
            <input className="w-full rounded-xl border px-4 py-3" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input type="email" className="w-full rounded-xl border px-4 py-3" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Programme Interest</label>
            <input className="w-full rounded-xl border px-4 py-3" />
          </div>

          <button
            type="button"
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
