/*
    <boltArtifact>
        <boltAction type="shell">
            npm run start
        </boltAction>
        <boltAction type="file" filePath="src/index.js">
            console.log("Hello, world!");
        </boltAction>
    </boltArtifact>
*/

export class ArtifactProcessor {
  public currentArtifact: string;
  private onFileContent: (filePath: string, fileContent: string) => void;
  private onShellCommand: (shellCommand: string) => void;
  private processedActions: Set<string>;

  constructor(
    currentArtifact: string,
    onFileContent: (filePath: string, fileContent: string) => void,
    onShellCommand: (shellCommand: string) => void
  ) {
    this.currentArtifact = currentArtifact;
    this.onFileContent = onFileContent;
    this.onShellCommand = onShellCommand;
    this.processedActions = new Set();
  }

  append(artifact: string) {
    this.currentArtifact += artifact;
  }

  parse() {
    // Find all complete boltAction blocks (with closing tags)
    const actionRegex =
      /<boltAction\s+type="([^"]+)"(?:\s+filePath="([^"]+)")?\s*>([\s\S]*?)<\/boltAction>/g;
    let match;

    while ((match = actionRegex.exec(this.currentArtifact)) !== null) {
      const [fullMatch, actionType, filePath, content] = match;

      // Create unique identifier for this action to avoid reprocessing
      const actionId = `${actionType}-${filePath || "shell"}-${match.index}`;

      if (this.processedActions.has(actionId)) {
        continue;
      }

      // Mark as processed
      this.processedActions.add(actionId);

      try {
        // Clean up content (remove leading/trailing whitespace and newlines)
        const cleanContent = content!.trim();

        console.log(`Processing action: ${actionType}`);
        console.log(`Content length: ${cleanContent.length}`);

        if (actionType === "shell") {
          console.log(`Executing shell command: ${cleanContent}`);
          this.onShellCommand(cleanContent);
        } else if (actionType === "file" && filePath) {
          console.log(`Writing file: ${filePath}`);
          console.log(`Content preview: ${cleanContent.substring(0, 100)}...`);
          this.onFileContent(filePath, cleanContent);
        }
      } catch (e) {
        console.error("Error parsing artifact:", e);
      }
    }
  }
}
