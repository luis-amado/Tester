"use client";

import FluidComponent from "~/components/FluidComponent";

export default function page() {
  return (
    <main className="flex grow flex-col items-center justify-center">
      <div className="bg-light text-dark h-300 w-100 p-5">
        <FluidComponent baseStretchScale={1.1} maxStretchScale={0.2}>
          <button
            className="bg-dark/80 text-light border-dark/20 flex h-15 w-15 items-center justify-center rounded-full border text-3xl backdrop-blur-xl"
            onClick={() => alert("Wow")}
          >
            +
          </button>
        </FluidComponent>
      </div>
    </main>
  );
}
