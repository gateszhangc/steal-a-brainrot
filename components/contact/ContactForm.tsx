"use client";

import { useState } from "react";

type FormState = {
  Name: string;
  Email: string;
  Website: string;
  Topic: string;
  Message: string;
  contactChecked: boolean;
};

const defaultState: FormState = {
  Name: "",
  Email: "",
  Website: "",
  Topic: "Others",
  Message: "",
  contactChecked: false
};

const topics = [
  "Others",
  "Advertisement",
  "Copyright Infringement",
  "Technical Issues",
  "New Game Requests",
  "Game Error Report"
];

export function ContactForm() {
  const [form, setForm] = useState<FormState>(defaultState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const resetForm = () => {
    setForm(defaultState);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Unable to submit form right now.");
      }

      setStatus("success");
      setFeedback(data.message ?? "Thanks for reaching out! We'll reply shortly.");
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Try again later.";
      setStatus("error");
      setFeedback(message);
    }
  };

  const inputClassName =
    "h-12 rounded-lg border border-white/10 bg-night px-4 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      <div className="grid gap-2">
        <label htmlFor="Name" className="text-sm font-semibold text-white/80">
          Your name
        </label>
        <input
          id="Name"
          name="Name"
          type="text"
          value={form.Name}
          onChange={handleChange}
          required
          maxLength={60}
          className={inputClassName}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="Email" className="text-sm font-semibold text-white/80">
          Email address
        </label>
        <input
          id="Email"
          name="Email"
          type="email"
          value={form.Email}
          onChange={handleChange}
          required
          maxLength={120}
          className={inputClassName}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="Website" className="text-sm font-semibold text-white/80">
          Website or profile (optional)
        </label>
        <input
          id="Website"
          name="Website"
          type="url"
          value={form.Website}
          onChange={handleChange}
          maxLength={120}
          className={inputClassName}
          placeholder="https://"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="Topic" className="text-sm font-semibold text-white/80">
          Topic
        </label>
        <select
          id="Topic"
          name="Topic"
          value={form.Topic}
          onChange={handleChange}
          className={`${inputClassName} h-12`}
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="Message" className="text-sm font-semibold text-white/80">
          Message
        </label>
        <textarea
          id="Message"
          name="Message"
          rows={6}
          value={form.Message}
          onChange={handleChange}
          required
          maxLength={3000}
          className="rounded-lg border border-white/10 bg-night px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-white/70">
        <input
          type="checkbox"
          name="contactChecked"
          checked={form.contactChecked}
          onChange={handleChange}
          className="mt-1 h-4 w-4 rounded border-white/30 bg-night text-accent focus:ring-accent"
        />
        I agree to the{" "}
        <a href="/term-of-use" className="text-accent underline-offset-4 hover:underline">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-accent underline-offset-4 hover:underline">
          Privacy Policy
        </a>
        .
      </label>
      {feedback && (
        <p className={`text-sm ${status === "error" ? "text-red-400" : "text-accent"}`} aria-live="polite">
          {feedback}
        </p>
      )}
      <button type="submit" className="control-button justify-center" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
