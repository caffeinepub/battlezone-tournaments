import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ban, Eye, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserDetailModal } from "../../../components/admin/UserDetailModal";
import { CoinBadge } from "../../../components/shared/CoinBadge";
import { useData } from "../../../contexts/DataContext";
import type { LocalUser } from "../../../types";

export function AdminUserApprovals() {
  const { users, updateUser, transactions } = useData();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<LocalUser | null>(null);

  const allNonAdminUsers = users.filter((u) => u.role !== "admin");

  const filtered = allNonAdminUsers.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.inGameName.toLowerCase().includes(q) ||
      u.freeFireUID.toLowerCase().includes(q)
    );
  });

  const handleBan = (userId: string, name: string) => {
    updateUser(userId, { status: "banned" });
    toast.success(`${name} has been banned.`);
  };

  const handleUnban = (userId: string, name: string) => {
    updateUser(userId, { status: "approved" });
    toast.success(`${name} has been unbanned.`);
  };

  const getTournamentCount = (userId: string) =>
    transactions.filter(
      (t) => t.userId === userId && t.actionType === "entry_fee",
    ).length;

  const getStatusBadge = (status: string) => {
    if (status === "banned") {
      return (
        <Badge
          className="text-xs font-bold"
          style={{
            background: "rgba(255,68,68,0.12)",
            border: "1px solid rgba(255,68,68,0.35)",
            color: "#ff6b6b",
          }}
        >
          Banned
        </Badge>
      );
    }
    return (
      <Badge
        className="text-xs font-bold"
        style={{
          background: "rgba(57,255,20,0.1)",
          border: "1px solid rgba(57,255,20,0.3)",
          color: "#39ff14",
        }}
      >
        Active
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: "#00f5ff" }} />
          <h2
            className="font-display font-bold text-lg"
            style={{ color: "#e2e8f0" }}
          >
            All Users
          </h2>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(0,245,255,0.08)",
              border: "1px solid rgba(0,245,255,0.2)",
              color: "#00f5ff",
            }}
          >
            {allNonAdminUsers.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: "#475569" }}
          />
          <Input
            placeholder="Search name, email, IGN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="admin.users.search_input"
            className="pl-9 h-8 text-xs font-mono"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0",
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(13,13,26,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {filtered.length === 0 ? (
          <div
            className="py-16 text-center"
            data-ocid="admin.users.empty_state"
          >
            <Users
              className="w-8 h-8 mx-auto mb-2 opacity-20"
              style={{ color: "#00f5ff" }}
            />
            <p className="text-sm" style={{ color: "#475569" }}>
              {search
                ? "No users match your search"
                : "No users registered yet"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <TableHead style={{ color: "#64748b" }}>#</TableHead>
                <TableHead style={{ color: "#64748b" }}>Name</TableHead>
                <TableHead style={{ color: "#64748b" }}>Email</TableHead>
                <TableHead style={{ color: "#64748b" }}>IGN</TableHead>
                <TableHead style={{ color: "#64748b" }}>FF UID</TableHead>
                <TableHead style={{ color: "#64748b" }}>Balance</TableHead>
                <TableHead style={{ color: "#64748b" }}>Tournaments</TableHead>
                <TableHead style={{ color: "#64748b" }}>Joined</TableHead>
                <TableHead style={{ color: "#64748b" }}>Status</TableHead>
                <TableHead style={{ color: "#64748b" }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user, i) => (
                <TableRow
                  key={user.id}
                  data-ocid={`admin.users.row.${i + 1}`}
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <TableCell
                    className="text-xs font-mono"
                    style={{ color: "#475569" }}
                  >
                    {i + 1}
                  </TableCell>
                  <TableCell
                    className="font-medium"
                    style={{ color: "#e2e8f0" }}
                  >
                    {user.fullName}
                  </TableCell>
                  <TableCell className="text-sm" style={{ color: "#94a3b8" }}>
                    {user.email}
                  </TableCell>
                  <TableCell
                    className="font-mono text-sm"
                    style={{ color: "#00f5ff" }}
                  >
                    {user.inGameName}
                  </TableCell>
                  <TableCell
                    className="font-mono text-xs"
                    style={{ color: "#64748b" }}
                  >
                    {user.freeFireUID}
                  </TableCell>
                  <TableCell>
                    <CoinBadge amount={user.coinBalance} size="sm" />
                  </TableCell>
                  <TableCell
                    className="text-sm font-mono"
                    style={{ color: "#94a3b8" }}
                  >
                    {getTournamentCount(user.id)}
                  </TableCell>
                  <TableCell
                    className="text-xs font-mono"
                    style={{ color: "#64748b" }}
                  >
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        data-ocid={`admin.view.button.${i + 1}`}
                        className="h-7 text-xs font-bold"
                        style={{
                          background: "rgba(0,245,255,0.06)",
                          border: "1px solid rgba(0,245,255,0.25)",
                          color: "#00f5ff",
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {user.status === "banned" ? (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnban(user.id, user.fullName);
                          }}
                          data-ocid={`admin.unban.button.${i + 1}`}
                          className="h-7 text-xs font-bold"
                          style={{
                            background: "rgba(57,255,20,0.08)",
                            border: "1px solid rgba(57,255,20,0.3)",
                            color: "#39ff14",
                          }}
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBan(user.id, user.fullName);
                          }}
                          data-ocid={`admin.ban.button.${i + 1}`}
                          className="h-7 text-xs font-bold"
                          style={{
                            background: "rgba(255,68,68,0.06)",
                            border: "1px solid rgba(255,68,68,0.25)",
                            color: "#ff6b6b",
                          }}
                        >
                          <Ban className="w-3 h-3 mr-1" />
                          Ban
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
