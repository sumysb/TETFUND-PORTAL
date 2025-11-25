"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Role = "admin" | "department" | "school";

const departments = [
  { id: "hr", label: "Human Resources" },
  { id: "astd", label: "AST&D" },
  { id: "deso", label: "Deso" },
  { id: "fin", label: "Finance" },
  { id: "ict", label: "ICT" },
  { id: "dess", label: "DESS" },
  { id: "me", label: "Monitoring and Evaluation" },
  { id: "rnd", label: "R&D" },
];

const roleMeta: Record<
  Role,
  {
    title: string;
    badge: string;
    summary: string;
    responsibilities: string[];
    note: string;
  }
> = {
  admin: {
    title: "Admin Control Desk",
    badge: "Platform Guardians",
    summary:
      "Admins keep accounts tidy, provision new access, and trail every file exchange for compliance.",
    responsibilities: [
      "Manage users and reset credentials",
      "Audit file movements across departments",
      "Configure reporting and compliance windows",
    ],
    note: "Need to recover a lost pass phrase? Use the Admin Support link.",
  },
  department: {
    title: "Department Exchange Hub",
    badge: "Document Routing",
    summary:
      "Departments send and receive sensitive documents, acknowledge deliveries, and escalate exceptions.",
    responsibilities: [
      "Dispatch memos, contracts, and policy attachments",
      "Receive counter-signed packets from partner units",
      "Track delivery and escalate routing issues",
    ],
    note: "Department staff IDs are issued by HR. Contact HR if yours is inactive.",
  },
  school: {
    title: "School Service Desk",
    badge: "Requests & Issues",
    summary:
      "Schools upload service requests, track fulfillment promises, and report incidents from the field.",
    responsibilities: [
      "Submit procurement or maintenance requests",
      "Attach supporting documents and receipts",
      "Raise incident reports directly to HQ assist teams",
    ],
    note: "Schools authenticate with their code only—keep it confidential.",
  },
};

const createFormState = () => ({
  admin: { username: "", password: "" },
  department: { departmentKey: departments[0].id, departmentId: "", staffId: "" },
  school: { username: "", schoolId: "", intent: "request" },
});

type FormState = ReturnType<typeof createFormState>;

type StatusState =
  | { type: "idle"; message: "" }
  | { type: "success" | "error"; message: string };

export default function Home() {
  const [activeRole, setActiveRole] = useState<Role>("admin");
  const [forms, setForms] = useState<FormState>(() => createFormState());
  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const responsibilities = roleMeta[activeRole].responsibilities;

  const handleInputChange = (role: Role, field: string, value: string) => {
    setForms((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    setStatus({ type: "idle", message: "" });
  }, [activeRole]);

  const buildPayload = () => {
    if (activeRole === "admin") {
      return {
        role: "admin",
        username: forms.admin.username.trim(),
        password: forms.admin.password,
      } as const;
    }

    if (activeRole === "department") {
      return {
        role: "department",
        departmentKey: forms.department.departmentKey,
        departmentId: forms.department.departmentId.trim(),
        staffId: forms.department.staffId.trim(),
      } as const;
    }

    return {
      role: "school",
      username: forms.school.username.trim(),
      schoolId: forms.school.schoolId.trim(),
    } as const;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result?.error ?? "Authentication failed.");
      }

      setStatus({
        type: "success",
        message: result.message ?? "Authenticated successfully.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error occurred.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disableSubmit = useMemo(() => {
    if (activeRole === "admin") {
      return !forms.admin.username || !forms.admin.password;
    }
    if (activeRole === "department") {
      return (
        !forms.department.departmentKey ||
        !forms.department.departmentId.trim() ||
        !forms.department.staffId.trim()
      );
    }
    return !forms.school.username.trim() || !forms.school.schoolId.trim();
  }, [activeRole, forms]);

  const handleAssistance = () => {
    window.alert("Please reach the service desk for the role you selected.");
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.badge}>Unified Access Portal</span>
          <h1>Secure access for Admins, Departments, and Schools</h1>
          <p>
            Choose the workflow that matches your level of responsibility. The portal
            keeps each process predictable and auditable—no frills, just the tools
            teams rely on every day.
          </p>
          <div className={styles.highlights}>
            <article className={styles.highlight}>
              <span>Admins</span>
              <strong>Manage users & file trails</strong>
            </article>
            <article className={styles.highlight}>
              <span>Departments</span>
              <strong>Send & receive documents</strong>
            </article>
            <article className={styles.highlight}>
              <span>Schools</span>
              <strong>Upload requests & report issues</strong>
            </article>
          </div>
        </section>

        <section className={styles.workspace}>
          <aside className={styles.roles} aria-label="Access levels">
            {(Object.keys(roleMeta) as Role[]).map((role) => (
              <button
                key={role}
                type="button"
                className={`${styles.role} ${
                  role === activeRole ? styles.activeRole : ""
                }`}
                onClick={() => setActiveRole(role)}
              >
                <h3>{roleMeta[role].title}</h3>
                <p>{roleMeta[role].summary}</p>
              </button>
            ))}
          </aside>

          <div className={styles.forms}>
            <div className={styles.formHeader}>
              <h2>{roleMeta[activeRole].title}</h2>
              <span className={styles.badge}>{roleMeta[activeRole].badge}</span>
            </div>
            <p className={styles.helper}>{roleMeta[activeRole].summary}</p>
            <ul className={styles.list}>
              {responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.divider} />

            <form className={styles.formGrid} onSubmit={handleSubmit}>
              {activeRole === "admin" && (
                <>
                  <div className={styles.field}>
                    <label htmlFor="admin-username">Admin username</label>
                    <input
                      id="admin-username"
                      className={styles.input}
                      type="text"
                      placeholder="e.g. sys.supervisor"
                      value={forms.admin.username}
                      onChange={(event) =>
                        handleInputChange("admin", "username", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <div className={styles.labelRow}>
                      <label htmlFor="admin-password">Password</label>
                      <span className={styles.hint}>Minimum 10 characters</span>
                    </div>
                    <input
                      id="admin-password"
                      className={styles.input}
                      type="password"
                      placeholder="••••••••••"
                      value={forms.admin.password}
                      onChange={(event) =>
                        handleInputChange("admin", "password", event.target.value)
                      }
                      required
                    />
        </div>
                </>
              )}

              {activeRole === "department" && (
                <>
                  <div className={styles.field}>
                    <label htmlFor="department-name">Choose department</label>
                    <select
                      id="department-name"
                      className={styles.select}
                      value={forms.department.departmentKey}
                      onChange={(event) =>
                        handleInputChange(
                          "department",
                          "departmentKey",
                          event.target.value
                        )
                      }
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="department-id">Departmental ID</label>
                    <input
                      id="department-id"
                      className={styles.input}
                      type="text"
                      placeholder="e.g. DPT-2458"
                      value={forms.department.departmentId}
                      onChange={(event) =>
                        handleInputChange(
                          "department",
                          "departmentId",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="staff-id">Staff ID</label>
                    <input
                      id="staff-id"
                      className={styles.input}
                      type="text"
                      placeholder="e.g. HR-7788"
                      value={forms.department.staffId}
                      onChange={(event) =>
                        handleInputChange(
                          "department",
                          "staffId",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>
                </>
              )}

              {activeRole === "school" && (
                <>
                  <div className={styles.field}>
                    <label htmlFor="school-username">School username</label>
                    <input
                      id="school-username"
                      className={styles.input}
                      type="text"
                      placeholder="e.g. riverdale.primary"
                      value={forms.school.username}
                      onChange={(event) =>
                        handleInputChange("school", "username", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="school-id">School ID</label>
                    <input
                      id="school-id"
                      className={styles.input}
                      type="text"
                      placeholder="e.g. SCH-00532"
                      value={forms.school.schoolId}
                      onChange={(event) =>
                        handleInputChange("school", "schoolId", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="school-intent">What do you need today?</label>
                    <select
                      id="school-intent"
                      className={styles.select}
                      value={forms.school.intent}
                      onChange={(event) =>
                        handleInputChange("school", "intent", event.target.value)
                      }
                    >
                      <option value="request">Submit a request</option>
                      <option value="issue">Report an issue</option>
                      <option value="followup">Check a pending ticket</option>
                    </select>
                  </div>
                  <p className={styles.helper}>
                    Schools authenticate without passwords. Keep your school ID private.
                  </p>
                </>
              )}

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={disableSubmit || isSubmitting}
                >
                  {isSubmitting ? "Working..." : `Continue as ${activeRole}`}
                </button>
                <button
                  type="button"
                  className={`${styles.submit} ${styles.outlined}`}
                  onClick={handleAssistance}
                >
                  Need assistance?
                </button>
              </div>
              {status.type !== "idle" && (
                <p
                  aria-live="polite"
                  role={status.type === "error" ? "alert" : "status"}
                  className={`${styles.status} ${
                    status.type === "error" ? styles.statusError : styles.statusSuccess
                  }`}
                >
                  {status.message}
                </p>
              )}
              <p className={styles.note}>{roleMeta[activeRole].note}</p>
            </form>
          </div>
        </section>
        </div>
    </div>
  );
}
