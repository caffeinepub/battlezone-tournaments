import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Edit2, User } from "lucide-react";
import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { CoinBadge } from "../components/shared/CoinBadge";
import { UserStatusBadge } from "../components/shared/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export function ProfilePage() {
  const { updateUser, users } = useData();
  const { session } = useAuth();

  const liveUser = users.find((u) => u.id === session?.userId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: liveUser?.fullName ?? "",
    freeFireUID: liveUser?.freeFireUID ?? "",
    inGameName: liveUser?.inGameName ?? "",
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    freeFireUID?: string;
    inGameName?: string;
  }>({});
  const [saved, setSaved] = useState(false);

  const handleEdit = () => {
    setForm({
      fullName: liveUser?.fullName ?? "",
      freeFireUID: liveUser?.freeFireUID ?? "",
      inGameName: liveUser?.inGameName ?? "",
    });
    setEditing(true);
    setSaved(false);
  };

  const handleSave = () => {
    const newErrors: typeof errors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.freeFireUID.trim()) newErrors.freeFireUID = "UID is required.";
    if (!form.inGameName.trim()) newErrors.inGameName = "IGN is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateUser(session!.userId, {
      fullName: form.fullName.trim(),
      freeFireUID: form.freeFireUID.trim(),
      inGameName: form.inGameName.trim(),
    });
    setEditing(false);
    setSaved(true);
    setErrors({});
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
  };

  if (!liveUser) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-6 h-6" style={{ color: "#00f5ff" }} />
          <h1
            className="font-display font-black text-3xl"
            style={{ color: "#e2e8f0" }}
          >
            Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(0,245,255,0.15)",
          }}
        >
          {/* Header */}
          <div
            className="p-6 flex items-center gap-4 border-b"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,245,255,0.06), rgba(57,255,20,0.03))",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-display font-black text-2xl border"
              style={{
                background: "rgba(0,245,255,0.1)",
                borderColor: "rgba(0,245,255,0.3)",
                color: "#00f5ff",
                textShadow: "0 0 10px rgba(0,245,255,0.5)",
              }}
            >
              {liveUser.inGameName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2
                  className="font-display font-bold text-xl"
                  style={{ color: "#e2e8f0" }}
                >
                  {liveUser.inGameName}
                </h2>
                <UserStatusBadge status={liveUser.status} />
                {liveUser.role === "admin" && (
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded border"
                    style={{
                      color: "#8b5cf6",
                      borderColor: "rgba(139,92,246,0.4)",
                      background: "rgba(139,92,246,0.1)",
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                {liveUser.email}
              </p>
            </div>
            <CoinBadge amount={liveUser.coinBalance} size="md" />
          </div>

          {/* Fields */}
          <div className="p-6 space-y-5">
            {saved && (
              <Alert
                style={{
                  background: "rgba(57,255,20,0.06)",
                  border: "1px solid rgba(57,255,20,0.3)",
                }}
                data-ocid="profile.save.success_state"
              >
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: "#39ff14" }}
                />
                <AlertDescription style={{ color: "#39ff14" }}>
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label
                  style={{ color: "#64748b" }}
                  className="text-xs uppercase tracking-wide"
                >
                  Full Name
                </Label>
                {editing ? (
                  <>
                    <Input
                      value={form.fullName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, fullName: e.target.value }))
                      }
                      data-ocid="profile.fullname.input"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(0,245,255,0.2)",
                        color: "#e2e8f0",
                      }}
                    />
                    {errors.fullName && (
                      <p className="text-xs" style={{ color: "#ff4444" }}>
                        {errors.fullName}
                      </p>
                    )}
                  </>
                ) : (
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#e2e8f0" }}
                  >
                    {liveUser.fullName}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <Label
                  style={{ color: "#64748b" }}
                  className="text-xs uppercase tracking-wide"
                >
                  Email
                </Label>
                <p className="text-sm font-medium" style={{ color: "#94a3b8" }}>
                  {liveUser.email}
                </p>
              </div>

              {/* Free Fire UID */}
              <div className="space-y-1.5">
                <Label
                  style={{ color: "#64748b" }}
                  className="text-xs uppercase tracking-wide"
                >
                  Free Fire UID
                </Label>
                {editing ? (
                  <>
                    <Input
                      value={form.freeFireUID}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, freeFireUID: e.target.value }))
                      }
                      data-ocid="profile.ffuid.input"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(0,245,255,0.2)",
                        color: "#e2e8f0",
                      }}
                    />
                    {errors.freeFireUID && (
                      <p className="text-xs" style={{ color: "#ff4444" }}>
                        {errors.freeFireUID}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-mono text-sm" style={{ color: "#e2e8f0" }}>
                    {liveUser.freeFireUID}
                  </p>
                )}
              </div>

              {/* In-Game Name */}
              <div className="space-y-1.5">
                <Label
                  style={{ color: "#64748b" }}
                  className="text-xs uppercase tracking-wide"
                >
                  In-Game Name
                </Label>
                {editing ? (
                  <>
                    <Input
                      value={form.inGameName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, inGameName: e.target.value }))
                      }
                      data-ocid="profile.ign.input"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(0,245,255,0.2)",
                        color: "#e2e8f0",
                      }}
                    />
                    {errors.inGameName && (
                      <p className="text-xs" style={{ color: "#ff4444" }}>
                        {errors.inGameName}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-mono text-sm" style={{ color: "#e2e8f0" }}>
                    {liveUser.inGameName}
                  </p>
                )}
              </div>

              {/* Account Status */}
              <div className="space-y-1.5">
                <Label
                  style={{ color: "#64748b" }}
                  className="text-xs uppercase tracking-wide"
                >
                  Account Status
                </Label>
                <UserStatusBadge status={liveUser.status} />
              </div>

              {/* Joined */}
              <div className="space-y-1.5">
                <Label
                  style={{ color: "#64748b" }}
                  className="text-xs uppercase tracking-wide"
                >
                  Member Since
                </Label>
                <p className="text-sm font-mono" style={{ color: "#94a3b8" }}>
                  {new Date(liveUser.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {editing ? (
                <>
                  <Button
                    onClick={handleSave}
                    data-ocid="profile.save_button"
                    className="flex items-center gap-2 font-bold h-10"
                    style={{
                      background: "rgba(57,255,20,0.1)",
                      border: "1px solid rgba(57,255,20,0.4)",
                      color: "#39ff14",
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    data-ocid="profile.cancel_button"
                    variant="ghost"
                    className="h-10"
                    style={{ color: "#64748b" }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEdit}
                  data-ocid="profile.edit_button"
                  className="flex items-center gap-2 font-bold h-10"
                  style={{
                    background: "rgba(0,245,255,0.05)",
                    border: "1px solid rgba(0,245,255,0.3)",
                    color: "#00f5ff",
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
