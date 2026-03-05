import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ban, CheckCircle2, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import { CoinBadge } from "../../../components/shared/CoinBadge";
import { UserStatusBadge } from "../../../components/shared/StatusBadge";
import { useData } from "../../../contexts/DataContext";

export function AdminUserApprovals() {
  const { users, updateUser } = useData();

  const pendingUsers = users.filter(
    (u) => u.status === "pending" && u.role !== "admin",
  );
  const allNonAdminUsers = users.filter((u) => u.role !== "admin");

  const handleApprove = (userId: string, name: string) => {
    updateUser(userId, { status: "approved" });
    toast.success(`${name} approved!`);
  };

  const handleReject = (userId: string, name: string) => {
    updateUser(userId, { status: "rejected" as const });
    toast.success(`${name} rejected.`);
  };

  const handleBan = (userId: string, name: string) => {
    updateUser(userId, { status: "banned" });
    toast.success(`${name} has been banned.`);
  };

  const handleUnban = (userId: string, name: string) => {
    updateUser(userId, { status: "approved" });
    toast.success(`${name} has been unbanned.`);
  };

  return (
    <div className="space-y-6">
      {/* Pending Approvals */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(13,13,26,0.95)",
          border: "1px solid rgba(255,215,0,0.2)",
        }}
      >
        <div
          className="p-4 border-b flex items-center gap-2"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Users className="w-4 h-4" style={{ color: "#ffd700" }} />
          <h2
            className="font-display font-bold text-base"
            style={{ color: "#e2e8f0" }}
          >
            Pending Approvals ({pendingUsers.length})
          </h2>
        </div>

        {pendingUsers.length === 0 ? (
          <div
            className="py-12 text-center"
            data-ocid="admin.approvals.empty_state"
          >
            <CheckCircle2
              className="w-8 h-8 mx-auto mb-2 opacity-30"
              style={{ color: "#39ff14" }}
            />
            <p style={{ color: "#475569" }}>No pending approvals</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <TableHead style={{ color: "#64748b" }}>Name</TableHead>
                <TableHead style={{ color: "#64748b" }}>Email</TableHead>
                <TableHead style={{ color: "#64748b" }}>
                  Free Fire UID
                </TableHead>
                <TableHead style={{ color: "#64748b" }}>IGN</TableHead>
                <TableHead style={{ color: "#64748b" }}>Registered</TableHead>
                <TableHead style={{ color: "#64748b" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((user, i) => (
                <TableRow
                  key={user.id}
                  data-ocid={`admin.pending.row.${i + 1}`}
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
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
                    style={{ color: "#94a3b8" }}
                  >
                    {user.freeFireUID}
                  </TableCell>
                  <TableCell
                    className="font-mono text-sm"
                    style={{ color: "#94a3b8" }}
                  >
                    {user.inGameName}
                  </TableCell>
                  <TableCell
                    className="text-xs font-mono"
                    style={{ color: "#64748b" }}
                  >
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(user.id, user.fullName)}
                        data-ocid={`admin.approve.button.${i + 1}`}
                        className="h-7 text-xs font-bold"
                        style={{
                          background: "rgba(57,255,20,0.1)",
                          border: "1px solid rgba(57,255,20,0.4)",
                          color: "#39ff14",
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReject(user.id, user.fullName)}
                        data-ocid={`admin.reject.button.${i + 1}`}
                        className="h-7 text-xs font-bold"
                        style={{
                          background: "rgba(255,68,68,0.08)",
                          border: "1px solid rgba(255,68,68,0.3)",
                          color: "#ff4444",
                        }}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* All Users */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(13,13,26,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="p-4 border-b flex items-center gap-2"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Users className="w-4 h-4" style={{ color: "#00f5ff" }} />
          <h2
            className="font-display font-bold text-base"
            style={{ color: "#e2e8f0" }}
          >
            All Users ({allNonAdminUsers.length})
          </h2>
        </div>

        {allNonAdminUsers.length === 0 ? (
          <div
            className="py-12 text-center"
            data-ocid="admin.users.empty_state"
          >
            <p style={{ color: "#475569" }}>No users registered</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <TableHead style={{ color: "#64748b" }}>Name</TableHead>
                <TableHead style={{ color: "#64748b" }}>Email</TableHead>
                <TableHead style={{ color: "#64748b" }}>IGN</TableHead>
                <TableHead style={{ color: "#64748b" }}>Balance</TableHead>
                <TableHead style={{ color: "#64748b" }}>Status</TableHead>
                <TableHead style={{ color: "#64748b" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allNonAdminUsers.map((user, i) => (
                <TableRow
                  key={user.id}
                  data-ocid={`admin.users.row.${i + 1}`}
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
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
                    style={{ color: "#94a3b8" }}
                  >
                    {user.inGameName}
                  </TableCell>
                  <TableCell>
                    <CoinBadge amount={user.coinBalance} size="sm" />
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    {user.status === "banned" ? (
                      <Button
                        size="sm"
                        onClick={() => handleUnban(user.id, user.fullName)}
                        data-ocid={`admin.unban.button.${i + 1}`}
                        className="h-7 text-xs"
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
                        onClick={() => handleBan(user.id, user.fullName)}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
