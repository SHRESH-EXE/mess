import ChromeButton from "@/src/components/ui/chrome-button";

export default function Default() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-900 p-12">
      <ChromeButton>Deploy Doom</ChromeButton>
    </div>
  );
}

export { Default as DemoChromeButton };
