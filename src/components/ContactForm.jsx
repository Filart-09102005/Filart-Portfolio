"use client";

import { useEffect, useRef, useState } from "react";

function CustomSelect({ id, name, value, onChange, placeholder, options, required, error }) {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, selectedIndex));
  const activeOption = options[activeIndex];

  useEffect(() => {
    if (!isOpen) return undefined;

    function closeOnOutsidePointer(event) {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  function openAt(index = selectedIndex >= 0 ? selectedIndex : 0) {
    setActiveIndex(index);
    setIsOpen(true);
  }

  function choose(option) {
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === "Tab" && isOpen) {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      if (!isOpen) {
        openAt(selectedIndex >= 0 ? selectedIndex : direction > 0 ? 0 : options.length - 1);
        return;
      }
      setActiveIndex((index) => (index + direction + options.length) % options.length);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) openAt();
      else if (activeOption) choose(activeOption);
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    }
  }

  return (
    <div className={`custom-select${isOpen ? " custom-select--open" : ""}`} ref={rootRef} data-open={isOpen}>
      <input type="hidden" name={name} value={value} />
      <button
        className={`custom-select__trigger${error ? " custom-select__trigger--invalid" : ""}`}
        id={`${id}-trigger`}
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-required={required || undefined}
        aria-invalid={error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-activedescendant={isOpen && activeOption ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : openAt())}
        onKeyDown={handleKeyDown}
      >
        <span className={!value ? "custom-select__value custom-select__value--placeholder" : "custom-select__value"} id={`${id}-value`}>
          {options.find((option) => option.value === value)?.label || placeholder}
        </span>
        <svg className="custom-select__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m3.5 6 4.5 4 4.5-4" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select__menu" id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`}>
          {options.map((option, index) => (
            <div
              className={`custom-select__option${index === activeIndex ? " custom-select__option--active" : ""}${option.value === value ? " custom-select__option--selected" : ""}`}
              id={`${id}-option-${index}`}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(option)}
            >
              <span>
                <strong>{option.label}</strong>
                {option.description && <small>{option.description}</small>}
              </span>
              {option.value === value && <span className="custom-select__check" aria-hidden="true">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SERVICE_OPTIONS = [
  { value: "Website or portfolio", label: "Website or portfolio", description: "New pages, redesigns, and personal sites" },
  { value: "Web application", label: "Web application", description: "Interactive products and online tools" },
  { value: "Mobile application", label: "Mobile application", description: "Mobile apps and companion systems" },
  { value: "Business system or dashboard", label: "Business system or dashboard", description: "POS, admin, and workflow systems" },
  { value: "Portfolio feedback or consultation", label: "Feedback or consultation", description: "A focused review or technical direction" },
  { value: "Something else", label: "Something else", description: "A different idea or question" },
];

const BUDGET_OPTIONS = [
  { value: "Under ₱5,000", label: "Under ₱5,000" },
  { value: "₱5,000–₱15,000", label: "₱5,000–₱15,000" },
  { value: "₱15,000–₱30,000", label: "₱15,000–₱30,000" },
  { value: "₱30,000+", label: "₱30,000+" },
  { value: "Not sure yet", label: "Not sure yet", description: "We can discuss a practical scope" },
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [serviceError, setServiceError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    if (!values.service) {
      setServiceError(true);
      document.getElementById("contact-service-trigger")?.focus();
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/consulting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company,
          service: values.service,
          budget: values.budget,
          timeline: values.timeline,
          details: values.details,
          website: values.website,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        setStatus({
          type: "error",
          message: result.message || "Your inquiry could not be sent. Please try again or email me directly.",
        });
        return;
      }

      form.reset();
      setService("");
      setBudget("");
      setStatus({ type: "success", message: "Thanks for reaching out. Your inquiry is on its way." });
    } catch {
      setStatus({
        type: "error",
        message: "Connection issue. Please try again or email me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__heading">
        <div>
          <span className="contact-form__eyebrow">CONSULTING INQUIRY</span>
          <h2>Tell me about it.</h2>
          <p>Share the essentials and I’ll reply with next steps. The more context you include, the more useful my first response can be.</p>
        </div>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4.75h16v11.5H9.25L4 20V4.75Z" />
          <path d="M8 9h8M8 12.5h5" />
        </svg>
      </div>

      <div className="contact-form__fields">
        <label className="contact-form__field">
          <span>Name <b aria-hidden="true">*</b></span>
          <input name="name" type="text" autoComplete="name" maxLength={100} placeholder="Your name" required />
        </label>

        <label className="contact-form__field">
          <span>Email <b aria-hidden="true">*</b></span>
          <input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required />
        </label>

        <label className="contact-form__field">
          <span>Company / organization</span>
          <input name="company" type="text" autoComplete="organization" maxLength={140} placeholder="Optional" />
        </label>

        <div className="contact-form__field">
          <span id="contact-service-label">What can I help with? <b aria-hidden="true">*</b></span>
          <CustomSelect
            id="contact-service"
            name="service"
            value={service}
            onChange={(nextValue) => {
              setService(nextValue);
              setServiceError(false);
            }}
            placeholder="Choose a focus"
            options={SERVICE_OPTIONS}
            required
            error={serviceError}
          />
          {serviceError && <span className="custom-select__error" id="contact-service-error">Choose a focus to continue.</span>}
        </div>

        <div className="contact-form__field">
          <span id="contact-budget-label">Budget range</span>
          <CustomSelect
            id="contact-budget"
            name="budget"
            value={budget}
            onChange={setBudget}
            placeholder="Choose a range (optional)"
            options={BUDGET_OPTIONS}
          />
        </div>

        <label className="contact-form__field">
          <span>Ideal timeline</span>
          <input name="timeline" type="text" maxLength={120} placeholder="e.g. next month, flexible" />
        </label>

        <label className="contact-form__field contact-form__field--full">
          <span>Project details <b aria-hidden="true">*</b></span>
          <textarea name="details" rows={6} maxLength={4000} placeholder="What are you working on, who is it for, and what would a successful outcome look like?" required />
        </label>

        <div className="contact-form__trap" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <p className="contact-form__helper">Please don’t include passwords, API keys, or other sensitive information.</p>

      <div className="contact-form__footer">
        <p className="contact-form__prefer-email">Prefer email? <a href="mailto:filarthg9@gmail.com">filarthg9@gmail.com</a></p>
        <button className="contact-form__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send inquiry"}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p
        className="contact-form__status"
        role={status.type === "error" ? "alert" : "status"}
        aria-live={status.type === "error" ? "assertive" : "polite"}
        data-state={status.type}
      >
        {status.message}
        {status.type === "error" && (
          <> <a href="mailto:filarthg9@gmail.com">Email me directly.</a></>
        )}
      </p>
    </form>
  );
}
