/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React from "react";
import SlackImage from "../components/SlackImage";

import { useEffect, useState } from "react";

function UserProfileImage({ imageUrl }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(null);

  console.log(imageUrl);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `/api/slack-image?fileUrl=${encodeURIComponent(imageUrl)}`,
        );
        if (!response.ok) throw new Error("Failed to load image");

        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        setImageSrc(objectURL);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchImage();

    // Cleanup the object URL
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageUrl]);

  if (error) return <p>Error loading image</p>;
  if (!imageSrc) return <p>Loading...</p>;

  return (
    <img src={imageSrc} alt="User Profile" className="h-20 w-20 rounded-full" />
  );
}

export default UserProfileImage;
