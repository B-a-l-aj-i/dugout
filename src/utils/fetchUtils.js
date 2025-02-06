import { throwErrorWithAdditionalMessage } from "./errorUtils";
import kyDefault from "ky";

class HTTPError extends Error {}

export const ky = kyDefault.extend({
  hooks: {
    afterResponse: [
      async (_, _1, response) => {
        if (!response.ok) {
          if (
            response.headers.get("content-type")?.includes("application/json")
          ) {
            if (import.meta.env.DEV === "development") {
              const errorResponseJson = await response.json();

              if (
                errorResponseJson &&
                typeof errorResponseJson === "object" &&
                "message" in errorResponseJson
              ) {
                console.error(errorResponseJson.message);
              } else {
                console.error(errorResponseJson);
              }

              return;
            } else {
              throw new HTTPError(
                `Fetch error ${response.status}: ${response.statusText} in ${response.url} failed}`,
              );
            }
          }

          const errorResponseText = await response.text();

          if (import.meta.env.DEV === "development") {
            console.error(errorResponseText);
          } else {
            throw new HTTPError(
              `Fetch error ${response.status}: ${response.statusText} in ${response.url} failed}`,
            );
          }
        }
      },
    ],
  },
});

export const kyGetFetcher = async (url, options) => {
  try {
    return await ky.get(url, options).text();
  } catch (error) {
    throwErrorWithAdditionalMessage(
      error,
      `Error fetching ${url} in kyGetFetcher function`,
    );
  }
};

export const kyGetJsonFetcher = async (url, options) => {
  try {
    return await ky.get(url, options).json();
  } catch (error) {
    throwErrorWithAdditionalMessage(
      error,
      `Error fetching ${url} in kyGetJsonFetcher function`,
    );
  }
};

export const kyPostJsonFetcher = async (url, options) => {
  try {
    return await ky.post(url, options).json();
  } catch (error) {
    throwErrorWithAdditionalMessage(
      error,
      `Error fetching ${url} in kyPostJsonFetcher function`,
    );
  }
};

export const slackFetcher = async (url) => {
  return await kyPostJsonFetcher(url, {
    body: `token=${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const fetcher = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch Slack data");
    return res.json();
  } catch (e) {
    console.log(e);
  }
};
