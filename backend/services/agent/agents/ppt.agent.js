import { getModel } from "../config/llmModels.js";
import generatePpt from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pptAgent = async (state) => {
  try {
    const llm = getModel("ppt");
    const prompt = `
You are a professional presentation designer.

Your task is to create a clear, professional, and visually engaging presentation based on the user's topic.

OUTPUT FORMAT:

{
  "title": "Presentation Title",
  "subtitle": "Short Subtitle",
  "slides": [
    {
      "title": "Slide Title",
      "points": [
        "Point 1",
        "Point 2",
        "Point 3",
        "Point 4"
      ]
    }
  ]
}

RULES:

- Generate exactly 6 content slides.
- Each slide must contain 4-6 concise bullet points.
- Each bullet point should be short and presentation-friendly.
- Avoid large paragraphs.
- Keep the content logically organized.
- Avoid repeating the same information across slides.
- Use simple and professional language.
- Include examples, comparisons, applications, or key facts when relevant.
- Do not invent statistics or factual information.
- The first slide should introduce the topic.
- The final slide should summarize the key points or provide a conclusion.
- No markdown.
- No explanation.
- No code block.
- Return ONLY valid JSON.
- Ensure the JSON can be directly parsed using JSON.parse().
- Do not use trailing commas.
- Do not add any text before or after the JSON.

TOPIC:

${state.prompt}
`;

    const agentRes = await llm.invoke(prompt);
    const data = JSON.parse(agentRes?.content);
    const pptBuffer = await generatePpt(data);
    const filename = `presentation-${data?.title}.pptx`;

    await uploadToS3(
      filename,
      pptBuffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const pptDownloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `
# 📊 Presentation Generated

**${data?.title}**

[📥 Download Presentation](${pptDownloadUrl})

> Download link expires in 24 hours.
`,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: "PPT Generation Failed!.",
    };
  }
};
