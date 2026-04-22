import cors from "cors";
import express from "express";
import { prismaClient } from "db/client";
import { GoogleGenAI } from "@google/genai";
import { systemPrompt } from "./systemPrompt";
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/prompt", async (req, res) => {
  const { prompt, projectId } = req.body;

  // Use GOOGLE_API_KEY to match your .env file
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GOOGLE_API_KEY not set" });
  }

  console.log("API Key present:", apiKey ? "Yes" : "No");

  await prismaClient.prompt.create({
    data: {
      content: prompt,
      projectId,
      type: "USER",
    },
  });

  const allPrompts = await prismaClient.prompt.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let artifactProcessor = new ArtifactProcessor(
    "",
    (filePath, fileContent) => onFileUpdate(filePath, fileContent, projectId),
    (shellCommand) => onShellCommand(shellCommand, projectId)
  );
  let artifact = "";

  try {
    // Initialize client with API key
    const client = new GoogleGenAI({
      apiKey: apiKey,
    });

    const tools = [
      {
        googleSearch: {},
      },
    ];

    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      imageConfig: {
        imageSize: "1K",
      },
      tools,
      systemInstruction: systemPrompt,
    };

    const model = "gemini-2.5-pro";

    // Build conversation contents from all prompts
    const contents = allPrompts.map((p: any) => ({
      role: p.type === "USER" ? "user" : "model",
      parts: [
        {
          text: p.content,
        },
      ],
    }));

    console.log("Sending request to Gemini API...");

    // Generate streaming response
    const response = await client.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Process streaming response
    for await (const chunk of response) {
      if (chunk.text) {
        artifactProcessor.append(chunk.text);
        artifactProcessor.parse();
        artifact += chunk.text;
      }
    }

    console.log("done!");

    await prismaClient.prompt.create({
      data: {
        content: artifact,
        projectId,
        type: "SYSTEM",
      },
    });

    await prismaClient.action.create({
      data: {
        content: "Done!",
        projectId,
      },
    });

    res.json({ response: "Success", artifact });
  } catch (error: any) {
    console.log("error", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error?.message || String(error),
    });
  }
});

app.listen(9091, () => {
  console.log("Server is running on port 9091");
});
