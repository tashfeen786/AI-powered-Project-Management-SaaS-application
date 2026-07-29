import { SettingsData } from "@/types/api";

export function BillingCard({ settings }: { settings?: SettingsData }) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
        <h2 className="text-base font-semibold text-text-primary">Billing & Usage</h2>
        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-bold uppercase tracking-wider">
          {settings?.billing?.plan || "Free"}
        </span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-background border border-border rounded-lg">
            <div className="text-xs text-text-secondary mb-1">Members</div>
            <div className="text-xl font-bold text-text-primary">{settings?.billing?.members || "1"}</div>
          </div>
          <div className="p-4 bg-background border border-border rounded-lg">
            <div className="text-xs text-text-secondary mb-1">Active Projects</div>
            <div className="text-xl font-bold text-text-primary">{settings?.billing?.projects || "1"}</div>
          </div>
          <div className="p-4 bg-background border border-border rounded-lg">
            <div className="text-xs text-text-secondary mb-1">Storage</div>
            <div className="text-lg font-bold text-text-primary">{settings?.billing?.storageUsed || "0 MB"}</div>
          </div>
          <div className="p-4 bg-background border border-border rounded-lg">
            <div className="text-xs text-text-secondary mb-1">API Tokens</div>
            <div className="text-lg font-bold text-text-primary">{settings?.billing?.apiUsage || "0"}</div>
          </div>
        </div>

        <button className="h-9 px-4 bg-background border border-border text-text-primary rounded-md text-sm font-medium hover:bg-surface focus:outline-none w-full md:w-auto transition-colors">
          Manage Subscription
        </button>
      </div>
    </div>
  );
}
