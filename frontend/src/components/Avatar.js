import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import API_URL from "api/config";

function Avatar({ src, nombre, className = "", iconFallback = false, bgClass = "bg-teal-600", textClass = "text-white font-bold" }) {
  const [failed, setFailed] = useState(false);

  const url = src
    ? src.startsWith("http") ? src : API_URL + src
    : null;

  const iniciales = (nombre || "?")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0] || "")
    .join("")
    .toUpperCase() || "?";

  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        className={`object-cover ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  if (iconFallback) {
    return <UserCircleIcon className={className} />;
  }

  return (
    <span className={`flex items-center justify-center ${bgClass} ${textClass} ${className}`}>
      {iniciales}
    </span>
  );
}

export default Avatar;
