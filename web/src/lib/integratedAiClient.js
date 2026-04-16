export const integratedAiClient = {
  stream: async (path, { body, signal, images = [] }) => {
    const formData = new FormData();
    formData.append('message', JSON.stringify(body.message));
    images.forEach((img) => formData.append('images', img));

    const response = await fetch(`http://localhost:3001${path}`, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error || `HTTP error ${response.status}`);
    }

    return response;
  },
};