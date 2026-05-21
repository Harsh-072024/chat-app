import React from "react";
import Image from "next/image";

type Props = {
  size?: number;
};

const LoadingLogo = ({ size = 100 }: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={size}
        height={size}
        className="animate-pluse"
        priority
      />
    </div>
  );
};

export default LoadingLogo;
