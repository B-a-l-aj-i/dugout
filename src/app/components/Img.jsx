"use client";
import React, { useState } from "react";
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
    </>
  );
}

export default Img;
