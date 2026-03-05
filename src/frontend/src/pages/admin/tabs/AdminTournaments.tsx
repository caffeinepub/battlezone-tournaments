import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Key, Plus, Swords } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CoinBadge } from "../../../components/shared/CoinBadge";
import { CountdownTimer } from "../../../components/shared/CountdownTimer";
import {
  MatchTypeBadge,
  TournamentStatusBadge,
} from "../../../components/shared/StatusBadge";
import { useData } from "../../../contexts/DataContext";
import type { Tournament } from "../../../types";

type FormData = {
  name: string;
  matchType: "solo" | "duo" | "squad";
  entryFee: string;
  prizePool: string;
  dateTime: string;
  maxPlayers: string;
  mapName: string;
  status: "upcoming" | "live" | "completed";
};

const EMPTY_FORM: FormData = {
  name: "",
  matchType: "solo",
  entryFee: "",
  prizePool: "",
  dateTime: "",
  maxPlayers: "",
  mapName: "",
  status: "upcoming",
};

export function AdminTournaments() {
  const { tournaments, createTournament, updateTournament } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Room editing state
  const [roomEditing, setRoomEditing] = useState<string | null>(null);
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Required";
    if (!form.entryFee || Number.isNaN(Number(form.entryFee)))
      newErrors.entryFee = "Invalid";
    if (!form.prizePool || Number.isNaN(Number(form.prizePool)))
      newErrors.prizePool = "Invalid";
    if (!form.dateTime) newErrors.dateTime = "Required";
    if (!form.maxPlayers || Number.isNaN(Number(form.maxPlayers)))
      newErrors.maxPlayers = "Invalid";
    if (!form.mapName.trim()) newErrors.mapName = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      name: form.name.trim(),
      matchType: form.matchType,
      entryFee: Number(form.entryFee),
      prizePool: Number(form.prizePool),
      dateTime: new Date(form.dateTime).toISOString(),
      maxPlayers: Number(form.maxPlayers),
      mapName: form.mapName.trim(),
      status: form.status,
    };

    if (editingId) {
      updateTournament(editingId, data);
      toast.success("Tournament updated!");
    } else {
      createTournament(data);
      toast.success("Tournament created!");
    }
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (t: Tournament) => {
    setEditingId(t.id);
    const localDate = new Date(t.dateTime);
    const offset = localDate.getTimezoneOffset();
    const adjusted = new Date(localDate.getTime() - offset * 60000);
    setForm({
      name: t.name,
      matchType: t.matchType,
      entryFee: String(t.entryFee),
      prizePool: String(t.prizePool),
      dateTime: adjusted.toISOString().slice(0, 16),
      maxPlayers: String(t.maxPlayers),
      mapName: t.mapName,
      status: t.status,
    });
    setShowForm(true);
  };

  const handleRoomSave = (tournamentId: string) => {
    updateTournament(tournamentId, {
      roomId,
      roomPassword,
    });
    setRoomEditing(null);
    toast.success("Room details updated!");
  };

  return (
    <div className="space-y-5">
      {/* Create Form */}
      {showForm && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(0,245,255,0.2)",
          }}
        >
          <h2
            className="font-display font-bold text-lg mb-4"
            style={{ color: "#e2e8f0" }}
          >
            {editingId ? "Edit Tournament" : "Create Tournament"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Tournament Name *
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="admin.tournament.name.input"
                  placeholder="e.g. Free Fire Sunday War"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.name && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Match Type *
                </Label>
                <Select
                  value={form.matchType}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      matchType: v as FormData["matchType"],
                    }))
                  }
                >
                  <SelectTrigger
                    data-ocid="admin.tournament.type.select"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(0,245,255,0.2)",
                      color: "#e2e8f0",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "rgba(13,13,26,0.98)",
                      border: "1px solid rgba(0,245,255,0.2)",
                    }}
                  >
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="duo">Duo</SelectItem>
                    <SelectItem value="squad">Squad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Entry Fee (Coins) *
                </Label>
                <Input
                  type="number"
                  value={form.entryFee}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, entryFee: e.target.value }))
                  }
                  data-ocid="admin.tournament.entryfee.input"
                  placeholder="e.g. 50"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.entryFee && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.entryFee}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Prize Pool (Coins) *
                </Label>
                <Input
                  type="number"
                  value={form.prizePool}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, prizePool: e.target.value }))
                  }
                  data-ocid="admin.tournament.prizepool.input"
                  placeholder="e.g. 400"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.prizePool && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.prizePool}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Date & Time *
                </Label>
                <Input
                  type="datetime-local"
                  value={form.dateTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dateTime: e.target.value }))
                  }
                  data-ocid="admin.tournament.datetime.input"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.dateTime && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.dateTime}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Max Players *
                </Label>
                <Input
                  type="number"
                  value={form.maxPlayers}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, maxPlayers: e.target.value }))
                  }
                  data-ocid="admin.tournament.maxplayers.input"
                  placeholder="e.g. 12"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.maxPlayers && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.maxPlayers}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Map Name *
                </Label>
                <Input
                  value={form.mapName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, mapName: e.target.value }))
                  }
                  data-ocid="admin.tournament.map.input"
                  placeholder="e.g. Bermuda"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    color: "#e2e8f0",
                  }}
                />
                {errors.mapName && (
                  <p className="text-xs" style={{ color: "#ff4444" }}>
                    {errors.mapName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: "#94a3b8" }} className="text-xs">
                  Status *
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, status: v as FormData["status"] }))
                  }
                >
                  <SelectTrigger
                    data-ocid="admin.tournament.status.select"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(0,245,255,0.2)",
                      color: "#e2e8f0",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "rgba(13,13,26,0.98)",
                      border: "1px solid rgba(0,245,255,0.2)",
                    }}
                  >
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                data-ocid="admin.tournament.submit_button"
                className="font-bold h-10 px-6"
                style={{
                  background: "rgba(0,245,255,0.1)",
                  border: "1px solid rgba(0,245,255,0.4)",
                  color: "#00f5ff",
                }}
              >
                {editingId ? "Update Tournament" : "Create Tournament"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
                data-ocid="admin.tournament.cancel_button"
                variant="ghost"
                className="h-10"
                style={{ color: "#64748b" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tournament List */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(13,13,26,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4" style={{ color: "#00f5ff" }} />
            <h2
              className="font-display font-bold text-base"
              style={{ color: "#e2e8f0" }}
            >
              Tournaments ({tournaments.length})
            </h2>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm(EMPTY_FORM);
            }}
            data-ocid="admin.tournament.open_modal_button"
            className="h-8 text-xs font-bold flex items-center gap-1"
            style={{
              background: "rgba(57,255,20,0.1)",
              border: "1px solid rgba(57,255,20,0.4)",
              color: "#39ff14",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Tournament
          </Button>
        </div>

        {tournaments.length === 0 ? (
          <div
            className="py-12 text-center"
            data-ocid="admin.tournaments.empty_state"
          >
            <p style={{ color: "#475569" }}>No tournaments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <TableHead style={{ color: "#64748b" }}>Name</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Type</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Entry</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Prize</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Players</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Timer</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Status</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Room</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Visible</TableHead>
                  <TableHead style={{ color: "#64748b" }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments.map((t, i) => (
                  <TableRow
                    key={t.id}
                    data-ocid={`admin.tournament.row.${i + 1}`}
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  >
                    <TableCell
                      className="font-medium text-sm"
                      style={{ color: "#e2e8f0" }}
                    >
                      {t.name}
                    </TableCell>
                    <TableCell>
                      <MatchTypeBadge matchType={t.matchType} />
                    </TableCell>
                    <TableCell>
                      <CoinBadge amount={t.entryFee} size="sm" />
                    </TableCell>
                    <TableCell>
                      <CoinBadge amount={t.prizePool} size="sm" />
                    </TableCell>
                    <TableCell
                      className="text-xs font-mono"
                      style={{ color: "#94a3b8" }}
                    >
                      {t.joinedUserIds.length}/{t.maxPlayers}
                    </TableCell>
                    <TableCell>
                      <CountdownTimer dateTime={t.dateTime} status={t.status} />
                    </TableCell>
                    <TableCell>
                      <TournamentStatusBadge status={t.status} />
                    </TableCell>
                    <TableCell>
                      {roomEditing === t.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Room ID"
                            className="h-6 text-xs w-24"
                            data-ocid={`admin.room.id.input.${i + 1}`}
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(0,245,255,0.2)",
                              color: "#e2e8f0",
                            }}
                          />
                          <Input
                            value={roomPassword}
                            onChange={(e) => setRoomPassword(e.target.value)}
                            placeholder="Password"
                            className="h-6 text-xs w-24"
                            data-ocid={`admin.room.password.input.${i + 1}`}
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(0,245,255,0.2)",
                              color: "#e2e8f0",
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleRoomSave(t.id)}
                            data-ocid={`admin.room.save_button.${i + 1}`}
                            className="h-6 text-xs px-2"
                            style={{
                              background: "rgba(57,255,20,0.1)",
                              border: "1px solid rgba(57,255,20,0.3)",
                              color: "#39ff14",
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setRoomEditing(t.id);
                            setRoomId(t.roomId ?? "");
                            setRoomPassword(t.roomPassword ?? "");
                          }}
                          data-ocid={`admin.room.edit_button.${i + 1}`}
                          className="flex items-center gap-1 text-xs hover:opacity-80"
                          style={{ color: t.roomId ? "#00f5ff" : "#64748b" }}
                        >
                          <Key className="w-3 h-3" />
                          {t.roomId ? t.roomId : "Set Room"}
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={t.roomVisible}
                        onCheckedChange={(v) => {
                          updateTournament(t.id, { roomVisible: v });
                          toast.success(
                            `Room ${v ? "visible" : "hidden"} for ${t.name}`,
                          );
                        }}
                        data-ocid={`admin.room.visibility.switch.${i + 1}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(t)}
                        data-ocid={`admin.tournament.edit_button.${i + 1}`}
                        className="h-7 text-xs font-bold"
                        style={{
                          background: "rgba(0,245,255,0.06)",
                          border: "1px solid rgba(0,245,255,0.25)",
                          color: "#00f5ff",
                        }}
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
