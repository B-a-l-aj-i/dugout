"use client";
import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

function Img({ url_private }) {
  return (
    <>
      {
        <div className="inline-flex cursor-pointer">
          <Zoom zoomMargin={90}>
            <img
              className="ml-2 mt-2 inline-flex cursor-pointer rounded-lg bg-black object-cover shadow-md transition-transform"
              src={`/api/slack-image?media=${encodeURIComponent(url_private)}`}
              alt="Slack Image"
              width={150}
            />
          </Zoom>
        </div>
      }
    </>
  );
}

export default Img;
