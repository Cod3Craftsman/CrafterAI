import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  const intentLlm = getModel("intent");
  const llm = getModel("coding");

  const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
  `);

  const intent = intentRes.content.trim();

  // CODE GENERATION
  if (intent === "CODE_GENERATION") {
    const prompt = `
You are CrafterAI Coding Agent.

Generate the requested project or code.

Default stack for web projects:
- HTML
- CSS
- JavaScript

For programming/code-only requests:
- Use the programming language explicitly requested by the user (C, C++, Java, Python, etc.).
- Do not generate HTML/CSS/JavaScript unless the user asks for a web project.
- If no language is specified for a programming problem, infer the most appropriate language from the user's request , take only 1 programming language which will be most effective if not described by the user.

Use React / Next.js / Vue, etc. ONLY if explicitly requested.

Rules:
- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless the user asks otherwise.
- Generate complete, functional code.
- Ensure all files work together correctly.
- Do not omit required code.
- Use Unsplash images if needed, do not add placeholders.


Token Usage Rules:
- You have a limited output budget of approximately 3072 tokens per request.
- Use the available tokens wisely.
- Keep the code concise and avoid unnecessary comments, whitespace, repetition, or explanations.
- Prioritize complete and functional code over verbose code.
- Do not sacrifice required functionality, responsiveness, or important UI details just to reduce token usage.
- Ensure the response is complete and does not get truncated.

Return ONLY valid JSON.

Schema:
{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

JSON Rules:
- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent
- All JSON strings must be properly escaped.
- Return valid JSON that can be parsed directly using JSON.parse().

User Request:
${state.prompt}
`;

    const res = await llm.invoke(prompt);

    const cleanResponse = res.content
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/\s*```$/, "")
      .trim();

    console.log("CLEANRESPONSE: ", cleanResponse);

    const data = JSON.parse(cleanResponse);

    return {
      ...state,
      aiResponse: "Code generated successfully!!",
      artifacts: [
        {
          id: Date.now(),
          type: "Project",
          files: data?.files || [],
          title: state.prompt,
        },
      ],
    };
  }

  // CODE REVIEW AND OTHERS
  const res = await llm.invoke(
    `
The user's request is:

${intent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request: ${state.prompt}

}
    `,
  );

  const data = res.content;

  return {
    ...state,
    aiResponse: data,
    artifacts: [],
  };
};
