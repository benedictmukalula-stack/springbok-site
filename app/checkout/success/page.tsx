type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id ?? "";

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-semibold">Payment successful</h1>
      <p className="mt-3 text-gray-700">
        Thank you. Your payment has been received.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Session reference: {sessionId || "Not supplied"}
      </p>
    </main>
  );
}
