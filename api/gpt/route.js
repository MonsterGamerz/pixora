export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { message } = await req.json();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify({ response: data.choices[0].message.content }), {
    headers: { "Content-Type": "application/json" },
  });
}
