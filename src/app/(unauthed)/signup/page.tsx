"use client";

import Link from "next/link";
import TextInput from "~/components/basic/TextInput";
import FluidComponent from "~/components/FluidComponent";

export default function page() {
  return (
    <main className="flex grow flex-col items-center justify-center">
      <div className="bg-light text-dark flex w-100 flex-col gap-2 rounded-xl p-8 shadow-md">
        <div>
          <h2 className="text-3xl font-bold">Sign up</h2>
          <p>Create your account.</p>
        </div>
        <TextInput label="Name" />
        <TextInput label="Username" />
        <TextInput label="Password" type="password" />
        <div className="mt-4 w-full">
          <FluidComponent
            className="w-full"
            maxStretchDistance={1}
            maxStretchScale={0}
          >
            <button className="bg-dark text-light hover:bg-dark/90 w-full cursor-pointer rounded-md p-2 transition">
              Sign up
            </button>
          </FluidComponent>
        </div>
        <Link className="w-full text-sm" href="/login">
          Already have an account?
        </Link>
      </div>
    </main>
  );
}
