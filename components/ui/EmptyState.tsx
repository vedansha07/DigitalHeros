import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="h-14 w-14 border border-cream-border bg-cream-dim flex items-center justify-center mb-5">
        <Icon size={24} className="text-ink-faint" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-ink mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted max-w-xs leading-relaxed mb-6 font-medium">{description}</p>
      )}
      {action}
    </div>
  );
}
