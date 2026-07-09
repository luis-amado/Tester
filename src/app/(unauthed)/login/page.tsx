"use client";

import Link from "next/link";
import { useState } from "react";
import TextInput from "~/components/basic/TextInput";
import FluidComponent from "~/components/FluidComponent";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function login() {
    if (username === "") {
      setUsernameError("You must enter a username");
    }
    if (password === "") {
      setPasswordError("You must enter a password");
    }
  }

  return (
    <main className="flex grow flex-col items-center justify-center">
      <div className="bg-light text-dark flex w-full max-w-100 flex-col gap-2 rounded-xl p-8 shadow-md">
        <div>
          <h2 className="text-3xl font-bold">Log in</h2>
          <p>Enter your account information.</p>
        </div>
        <TextInput
          label="Username"
          value={username}
          setValue={(val) => {
            setUsername(val);
            setUsernameError("");
          }}
          error={usernameError ?? ""}
        />
        <TextInput
          label="Password"
          type="password"
          value={password}
          setValue={(val) => {
            setPassword(val);
            setPasswordError("");
          }}
          error={passwordError ?? ""}
        />
        <div className="mt-4 w-full">
          <FluidComponent
            className="w-full"
            maxStretchDistance={1}
            maxStretchScale={0}
          >
            <button
              className="bg-dark text-light hover:bg-dark/90 w-full cursor-pointer rounded-md p-2 transition"
              onClick={login}
            >
              Log in
            </button>
          </FluidComponent>
        </div>
        <Link className="w-full text-sm" href="/signup">
          Don&apos;t have an account?
        </Link>
      </div>
    </main>
  );
}
