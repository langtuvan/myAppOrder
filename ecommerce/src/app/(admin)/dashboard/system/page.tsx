"use client";
import paths from "@/router/path";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SystemPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(paths.dashboard.system.users.root);
  }, []);
  return null;
};

export default SystemPage;
