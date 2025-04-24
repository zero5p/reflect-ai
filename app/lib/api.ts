export async function fetchReflections() {
  const response = await fetch("/api/reflections");
  if (!response.ok) {
    throw new Error("Failed to fetch reflections");
  }
  const data = await response.json();
  return data.reflections;
}

export async function fetchReflection(id: string) {
  const response = await fetch(`/api/reflections/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch reflection");
  }
  const data = await response.json();
  return data.reflection;
}

export async function createReflection(content: string, emotion: string) {
  const response = await fetch("/api/reflections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, emotion }),
  });

  if (!response.ok) {
    throw new Error("Failed to create reflection");
  }

  const data = await response.json();
  return data.reflection;
}

export async function updateReflection(
  id: string,
  content: string,
  emotion: string,
) {
  const response = await fetch(`/api/reflections/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, emotion }),
  });

  if (!response.ok) {
    throw new Error("Failed to update reflection");
  }

  const data = await response.json();
  return data.reflection;
}

export async function deleteReflection(id: string) {
  const response = await fetch(`/api/reflections/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete reflection");
  }

  return true;
}

// Calendar API
export async function fetchCalendarEvents(date?: string) {
  const url = date ? `/api/calendar?date=${encodeURIComponent(date)}` : "/api/calendar";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch calendar events");
  }
  const data = await response.json();
  return data;
}

export async function createCalendarEvent(event: {
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  category?: string;
  reflectionId?: string;
  isRecommended?: boolean;
}) {
  const response = await fetch("/api/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error("Failed to create calendar event");
  }
  return await response.json();
}

export async function deleteCalendarEvent(id: string) {
  const response = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete calendar event");
  }
  return true;
}
