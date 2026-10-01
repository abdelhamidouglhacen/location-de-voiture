"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { addMessage } from "@/lib/contactMessages";
import { email, hasErrors, minLength, phone, required, type Errors } from "@/lib/validation";

type Fields = { nom: string; email: string; telephone: string; message: string };
const empty: Fields = { nom: "", email: "", telephone: "", message: "" };

export function ContactForm() {
  const toast = useToast();
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors<Fields>>({});
  const [sending, setSending] = useState(false);

  const field = (name: keyof Fields) => ({
    id: `contact-${name}`,
    value: values[name],
    error: errors[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues({ ...values, [name]: e.target.value });
      setErrors({ ...errors, [name]: undefined });
    },
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found: Errors<Fields> = {
      nom: required(values.nom, "Name"),
      email: email(values.email),
      telephone: phone(values.telephone),
      message: required(values.message, "Message") ?? minLength(values.message, 10, "Message"),
    };
    setErrors(found);
    if (hasErrors(found)) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    addMessage({ nom: values.nom.trim(), email: values.email.trim(), telephone: values.telephone.trim(), message: values.message.trim() });
    setSending(false);
    setValues(empty);
    toast("Message sent, we will get back to you shortly.");
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 rounded-[20px] border border-line bg-surface p-6 sm:grid-cols-2 sm:p-8">
      <Input {...field("nom")} label="Name" autoComplete="name" required />
      <Input {...field("telephone")} label="Phone" type="tel" autoComplete="tel" required />
      <Input {...field("email")} label="Email" type="email" autoComplete="email" required wrapperClassName="sm:col-span-2" />
      <Textarea {...field("message")} label="Message" rows={5} required wrapperClassName="sm:col-span-2" placeholder="Dates, car you want, pick-up place…" />
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" loading={sending}>
          <Send className="size-4" aria-hidden />
          Send message
        </Button>
      </div>
    </form>
  );
}
