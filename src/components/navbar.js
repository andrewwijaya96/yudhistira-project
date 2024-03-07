import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/upload">Upload e</Link>
        </li>
      </ul>
    </nav>
  );
}
