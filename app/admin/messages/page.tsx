"use client";

import { Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/States";
import { Table } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { type ContactMessage, deleteMessage, setMessageStatus, type StatutMessage, useMessages } from "@/lib/contactMessages";
import { formatDateTime } from "@/lib/format";

const STATUTS: StatutMessage[] = ["New", "Read", "Handled"];
const TONES: Record<StatutMessage, BadgeTone> = { New: "amber", Read: "blue", Handled: "green" };

export default function MessagesPage() {
  const messages = useMessages();
  const toast = useToast();
  const [statut, setStatut] = useState("tous");
  const [openId, setOpenId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  const list = messages.filter((m) => statut === "tous" || m.statut === statut);
  const open = messages.find((m) => m.id === openId) ?? null;

  const view = (m: ContactMessage) => {
    if (m.statut === "New") setMessageStatus(m.id, "Read");
    setOpenId(m.id);
  };

  return (
    <div className="space-y-6">
      <Tabs
        label="Filter by status"
        value={statut}
        onChange={setStatut}
        tabs={[{ value: "tous", label: "All", count: messages.length }, ...STATUTS.map((s) => ({ value: s, label: s, count: messages.filter((m) => m.statut === s).length }))]}
      />

      <Card padded={false}>
        <Table
          caption="Received messages"
          rows={list}
          rowKey={(m) => m.id}
          empty={<EmptyState title="No messages" text="No messages match this filter." />}
          columns={[
            {
              key: "nom",
              header: "Sender",
              render: (m) => (
                <button type="button" onClick={() => view(m)} className="text-left hover:underline">
                  <span className={m.statut === "New" ? "block font-semibold" : "block font-medium"}>{m.nom}</span>
                  <span className="text-xs text-muted tabular-nums">{m.telephone}</span>
                </button>
              ),
            },
            {
              key: "message",
              header: "Message",
              render: (m) => <p className="line-clamp-2 max-w-md text-ink-2">{m.message}</p>,
            },
            { key: "date", header: "Received", render: (m) => formatDateTime(m.envoyeLe), className: "whitespace-nowrap tabular-nums" },
            { key: "statut", header: "Status", render: (m) => <Badge tone={TONES[m.statut]}>{m.statut}</Badge> },
            {
              key: "actions",
              header: "Actions",
              className: "text-right",
              render: (m) => (
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => view(m)}>
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:border-red-300" onClick={() => setToDelete(m)} aria-label={`Delete message from ${m.nom}`}>
                    <Trash2 className="size-3.5" aria-hidden />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.nom ?? ""}
        description={open ? `Received on ${formatDateTime(open.envoyeLe)}` : undefined}
        footer={
          open && (
            <>
              {open.statut === "Handled" ? (
                <Button variant="outline" onClick={() => setMessageStatus(open.id, "Read")}>
                  Mark as not handled
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setMessageStatus(open.id, "Handled");
                    toast("Message marked as handled.");
                    setOpenId(null);
                  }}
                >
                  Mark as handled
                </Button>
              )}
            </>
          )
        }
      >
        {open && (
          <div className="space-y-5">
            <p className="text-[15px] whitespace-pre-line text-ink">{open.message}</p>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              <Button size="sm" variant="outline" href={`tel:${open.telephone.replace(/\s/g, "")}`}>
                <Phone className="size-3.5" aria-hidden />
                {open.telephone}
              </Button>
              <Button size="sm" variant="outline" href={`https://wa.me/${open.telephone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-3.5" aria-hidden />
                WhatsApp
              </Button>
              <Button size="sm" variant="outline" href={`mailto:${open.email}`}>
                <Mail className="size-3.5" aria-hidden />
                {open.email}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete this message?"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!toDelete) return;
                deleteMessage(toDelete.id);
                toast("Message deleted.");
                setToDelete(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-muted">The message from {toDelete?.nom} will be permanently deleted.</p>
      </Modal>
    </div>
  );
}
