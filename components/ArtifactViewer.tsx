import ReactMarkdown from 'react-markdown';

export function ArtifactViewer({ markdown }: { markdown: string }) {
  return (
    <div className="prose max-w-none rounded border bg-white p-4">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
