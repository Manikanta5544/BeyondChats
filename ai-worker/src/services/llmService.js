import OpenAI from 'openai';

let client;

function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not set');
    }

    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return client;
}

function buildReferencesHtml(referenceUrls) {
  return `
<hr>
<h3>References</h3>
<ol>
${referenceUrls
  .map((u, i) => `<li><a href="${u}" target="_blank">Reference ${i + 1}</a></li>`)
  .join('\n')}
</ol>
`;
}

export async function enhanceWithLLM(original, references, referenceUrls) {
  if (process.env.LLM_MODE === 'mock') {
    return `
<h2>Enhanced Article</h2>

<p>${original.slice(0, 1000)}...</p>

<h3>Key Improvements</h3>
<ul>
  <li>Improved structure and readability</li>
  <li>Clarified key points</li>
  <li>Incorporated external insights</li>
</ul>

<p><em>
Note: This article was enhanced using mock data due to OpenAI API limitations.
</em></p>

${buildReferencesHtml(referenceUrls)}
`;
  }

  const prompt = `
You are an expert content editor.

Enhance the following article by:
- Preserving the original tone and voice
- Improving structure, clarity, and readability
- Adding valuable insights from the reference articles
- Keeping all facts accurate and professional

Original Article:
${original}

Reference Articles:
${references.map((ref, i) => `[Reference ${i + 1}]\n${ref}`).join('\n\n---\n\n')}

Return ONLY the enhanced article HTML.
`;

  const client = getClient();

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4
  });

  const enhanced = response.choices[0].message.content.trim();

  return enhanced + buildReferencesHtml(referenceUrls);
}
