import AppBar from "@/components/Appbar";
import { PromptBox } from "@/components/Prompt";
import TemplateButtons from "@/components/TemplateButtons";

export default function Home() {
  return (
    <div className="p-4">
      <AppBar />
      <div className="max-w-2xl mx-auto pt-32">
        <div className="text-2xl font-bold text-center">
          What do you want to build?
        </div>
        <div className="text-sm  text-muted-foreground text-center mt-2">
          Prompt, click generate and watch your app come to life
        </div>

        <div className="pt-6">
          <PromptBox />
        </div>

        <div className="pt-6">
          <TemplateButtons />
        </div>
      </div>
    </div>
  );
}
