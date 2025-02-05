"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SlackEventsPage() {
  const { data: events, error } = useSWR("/api/slack", fetcher, {
    refreshInterval: 3000, // Polling every 3 seconds
  });

  if (error) return <p>Failed to load events</p>;
  if (!events) return <p>Loading...</p>;

  return (
    <div>
      <h1>Slack Events</h1>
      <ul>
        {events.map((event, index: number) => (
          <li key={index}>
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
