import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="grid grid-cols-12 px-2 gap-20-px bg-gray-200 text-center">
      <h1 className="py-3">Yudhistira</h1>
      <Link href="/" className="hover:bg-gray-400 py-3">
        Home
      </Link>
      <Link href="/upload" className="hover:bg-gray-400 py-3">
        Upload
      </Link>
    </nav>
  );
}
