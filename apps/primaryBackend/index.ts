import "dotenv/config";
import { prismaClient } from "db/client";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";

const app = express();

app.use(express.json());
app.use(cors());

// Create a project
app.post("/project", authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.userId; // ✅ no need for !
    const description = prompt.split("\n")[0].trim();

    const project = await prismaClient.project.create({
      data: { description, userId },
    });

    res.json({ projectId: project.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get all projects for a user
app.get("/projects", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // ✅ no need for !
    const projects = await prismaClient.project.findMany({
      where: { userId },
    });
    res.json(projects);
  } catch (error) {
    console.error(error); // ✅ log the error
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
