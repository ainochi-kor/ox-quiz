"use client";

import { Button } from "@/components/ui/button";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import { useNavigate } from "react-router";

export function LoginPage() {
  const { setUserCredential } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleSign = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then((data) => {
        setUserCredential(data);
        navigate("/");
      })
      .catch((err) => alert(err));
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Hello OX</h1>
      <h1 className="text-2xl font-bold mb-5">ADMIN</h1>

      <div className="flex justify-end">
        <Button type="button" onClick={handleGoogleSign}>
          Google Login
        </Button>
      </div>
    </section>
  );
}
