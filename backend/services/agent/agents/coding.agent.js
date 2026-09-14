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

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

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

  //  CODE REVIEW AND OTHERS
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
