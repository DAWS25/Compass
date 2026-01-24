interface PlaceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 pb-24 dark:bg-black">
      <main className="w-full max-w-2xl">
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Place Detail
        </h1>
        <p className="mb-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Place ID: <span className="font-semibold">{id}</span>
        </p>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Detailed view for a specific location will be implemented here.
        </p>
      </main>
    </div>
  );
}

