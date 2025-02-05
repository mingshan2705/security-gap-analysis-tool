import React from "react";

function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 -z-30 flex h-[10dvh] w-[100dvw] items-center justify-end rounded-t-2xl border bg-gray-50 px-8 py-2 text-sm font-medium shadow-lg">
      <nav className="flex items-center justify-center gap-4">
        <ul className="flex gap-4">
          <li>Home</li>
        </ul>
        <div className="flex aspect-square w-12 items-center justify-center rounded-full border-2 border-black bg-gray-300">
          MS
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
