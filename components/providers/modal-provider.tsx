"use client";

import { useEffect, useState } from "react";
import LoginModal from "@/components/login-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <LoginModal />
    </>
  );
};

export default ModalProvider;
