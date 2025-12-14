export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-2">Welcome to Settings</h2>
      <p className="text-muted-foreground mb-6">
        Select a setting from the menu to get started. You can manage your bread
        pricing, user roles, notifications, and much more.
      </p>

      <div className="rounded-lg border border-border p-6 bg-muted/50">
        <h3 className="font-semibold mb-2">Quick Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li> Use Bread Pricing to update your product prices</li>
          <li> Manage Roles to control user access and permissions</li>
          <li> Configure Notifications to stay updated on important events</li>
          <li> Customize Appearance to match your preferences</li>
        </ul>
      </div>
    </div>
  );
}
