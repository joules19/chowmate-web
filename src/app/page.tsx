import Link from "next/link";

export default function Home() {
  return (
    <div>
      <ul className="flex gap-2">
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
      </ul>
    </div>
  );
}
