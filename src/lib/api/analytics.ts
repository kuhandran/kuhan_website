export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
  subject?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return { success: false, message: 'Failed to submit contact form' };
  }
}
