"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";

export default function Raiz() {
  const [splash, setSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!splash) router.replace("/inicio");
  }, [splash, router]);

  return (
    <div className="app-shell">
      {splash && <SplashScreen aoConcluir={() => setSplash(false)} />}
    </div>
  );
}
