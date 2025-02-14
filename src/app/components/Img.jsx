"use client";
import React, { useState } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

function Img({ url_private }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {
        <div className="inline-flex cursor-pointer">
          <Zoom className="inline-flex" zoomMargin={50}>
            <img
              className="mb-4 ml-4 inline-flex cursor-pointer rounded-lg bg-black object-cover shadow-md transition-transform"
              src={`/api/slack-image?image=${encodeURIComponent(url_private)}`}
              alt="Slack Image"
              width={90}
              height={90}
            />
          </Zoom>
        </div>
      }
      {/* <Image
        src={`/api/slack-image?image=${encodeURIComponent(url_private)}`}
        alt="Slack Image"
        width={100}
        height={100}
        className="mb-4 ml-4 inline-flex cursor-pointer rounded-lg shadow-md transition-transform hover:scale-105"
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative p-4">
            <Image
              src={`/api/slack-image?image=${encodeURIComponent(url_private)}`}
              alt="Enlarged"
              width={800}
              height={800}
              className="max-h-[90vh] max-w-[80vw] rounded-lg shadow-lg"
            />
            <button
              className="absolute right-6 top-6 rounded-md bg-black p-2 text-3xl font-bold text-white"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
          </div>
        </div>
      )} */}
    </>
  );
}

export default Img;
