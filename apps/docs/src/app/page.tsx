import Link from "next/link";

export default function Page() {
  return (
    <div className="container mx-auto">
      <div className="flex h-32 flex-col justify-center items-center">
        <h1 className="mb-4">Coming Soon...</h1>

        <Link
          href="/docs"
          className="bg-blue-500 text-xl px-8 py-2 rounded-full"
        >
          Docs
        </Link>
      </div>
    </div>
  );
}
