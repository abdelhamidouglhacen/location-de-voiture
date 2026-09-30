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

const STATUTS: StatutMessage[] = ["Nouveau", "Lu", "Traité"];
const TONES: Record<StatutMessage, BadgeTone> = { Nouveau: "amber", Lu: "blue", Traité: "green" };

export default function MessagesPage() {
  const messages = useMessages();
  const toast = useToast();
  const [statut, setStatut] = useState("tous");
  const [openId, setOpenId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  const list = messages.filter((m) => statut === "tous" || m.statut === statut);
  const open = messages.find((m) => m.id === openId) ?? null;

  const view = (m: ContactMessage) => {
    if (m.statut === "Nouveau") setMessageStatus(m.id, "Lu");
    setOpenId(m.id);
  };

  return (
    <div className="space-y-6">
      <Tabs
        label="Filtrer par statut"
        value={statut}
        onChange={setStatut}
        tabs={[{ value: "tous", label: "Tous", count: messages.length }, ...STATUTS.map((s) => ({ value: s, label: s, count: messages.filter((m) => m.statut === s).length }))]}
      />

      <Card padded={false}>
        <Table
          caption="Messages reçus"
          rows={list}
          rowKey={(m) => m.id}
          empty={<EmptyState title="Aucun message" text="Aucun message ne correspond à ce filtre." />}
          columns={[
            {
              key: "nom",
              header: "Expéditeur",
              render: (m) => (
                <button type="button" onClick={() => view(m)} className="text-left hover:underline">
                  <span className={m.statut === "Nouveau" ? "block font-semibold" : "block font-medium"}>{m.nom}</span>
                  <span className="text-xs text-muted tabular-nums">{m.telephone}</span>
                </button>
              ),
            },
            {
              key: "message",
              header: "Message",
              render: (m) => <p className="line-clamp-2 max-w-md text-ink-2">{m.message}</p>,
            },
            { key: "date", header: "Reçu le", render: (m) => formatDateTime(m.envoyeLe), className: "whitespace-nowrap tabular-nums" },
            { key: "statut", header: "Statut", render: (m) => <Badge tone={TONES[m.statut]}>{m.statut}</Badge> },
            {
              key: "actions",
              header: "Actions",
              className: "text-right",
              render: (m) => (
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => view(m)}>
                    Voir
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:border-red-300" onClick={() => setToDelete(m)} aria-label={`Supprimer le message de ${m.nom}`}>
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
        description={open ? `Reçu le ${formatDateTime(open.envoyeLe)}` : undefined}
        footer={
          open && (
            <>
              {open.statut === "Traité" ? (
                <Button variant="outline" onClick={() => setMessageStatus(open.id, "Lu")}>
                  Marquer non traité
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setMessageStatus(open.id, "Traité");
                    toast("Message marqué comme traité.");
                    setOpenId(null);
                  }}
                >
                  Marquer traité
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
        title="Supprimer ce message ?"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!toDelete) return;
                deleteMessage(toDelete.id);
                toast("Message supprimé.");
                setToDelete(null);
              }}
            >
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-muted">Le message de {toDelete?.nom} sera supprimé définitivement.</p>
      </Modal>
    </div>
  );
}
