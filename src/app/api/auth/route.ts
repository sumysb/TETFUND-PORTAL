import { NextResponse } from "next/server";
import { getPgPool } from "@/lib/db";

type Role = "admin" | "department" | "school";

type AdminPayload = {
  role: "admin";
  username?: string;
  password?: string;
};

type DepartmentPayload = {
  role: "department";
  departmentKey?: string;
  departmentId?: string;
  staffId?: string;
};

type SchoolPayload = {
  role: "school";
  username?: string;
  schoolId?: string;
};

type AuthPayload = AdminPayload | DepartmentPayload | SchoolPayload;

async function authenticateAdmin(payload: AdminPayload) {
  const { username, password } = payload;
  if (!username || !password) {
    return {
      ok: false as const,
      status: 400,
      error: "Username and password are required.",
    };
  }

  const pool = getPgPool();
  const result = await pool.query<{
    username: string;
    display_name: string;
    scope: string[];
    password_plain: string;
  }>(
    `
      SELECT username, display_name, scope, password_plain
      FROM admins
      WHERE username = $1
      LIMIT 1
    `,
    [username]
  );

  const row = result.rows[0];
  if (!row || row.password_plain !== password) {
    return { ok: false as const, status: 401, error: "Invalid admin credentials." };
  }

  return {
    ok: true as const,
    data: {
      displayName: row.display_name ?? row.username,
      scope: row.scope,
      message: "Admin authenticated. Redirecting to control center...",
    },
  };
}

async function authenticateDepartment(payload: DepartmentPayload) {
  const { departmentKey, departmentId, staffId } = payload;
  if (!departmentKey || !departmentId || !staffId) {
    return {
      ok: false as const,
      status: 400,
      error: "Select a department and provide departmental & staff IDs.",
    };
  }

  const pool = getPgPool();
  const result = await pool.query<{
    key: string;
    name: string;
    inbox: string;
  }>(
    `
      SELECT d.key, d.name, d.inbox
      FROM departments d
      JOIN department_staff ds ON ds.department_id = d.id
      WHERE d.key = $1
        AND d.department_code = $2
        AND ds.staff_code = $3
      LIMIT 1
    `,
    [departmentKey, departmentId, staffId]
  );

  const row = result.rows[0];
  if (!row) {
    return {
      ok: false as const,
      status: 401,
      error: "Departmental credentials not recognised.",
    };
  }

  return {
    ok: true as const,
    data: {
      department: row.name,
      inbox: row.inbox,
      message: "Department verified. Opening exchange workspace...",
    },
  };
}

async function authenticateSchool(payload: SchoolPayload) {
  const { username, schoolId } = payload;
  if (!username || !schoolId) {
    return {
      ok: false as const,
      status: 400,
      error: "School username and ID are required.",
    };
  }

  const pool = getPgPool();
  const result = await pool.query<{
    username: string;
    display_name: string;
    district: string;
  }>(
    `
      SELECT username, display_name, district
      FROM schools
      WHERE username = $1
        AND school_code = $2
      LIMIT 1
    `,
    [username, schoolId]
  );

  const row = result.rows[0];
  if (!row) {
    return { ok: false as const, status: 401, error: "School credentials not found." };
  }

  return {
    ok: true as const,
    data: {
      district: row.district,
      displayName: row.display_name ?? row.username,
      message: "School authenticated. Loading service desk...",
    },
  };
}

export async function POST(request: Request) {
  let payload: AuthPayload;
  try {
    payload = (await request.json()) as AuthPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  if (!payload.role) {
    return NextResponse.json(
      { ok: false, error: "Role is required for authentication." },
      { status: 400 }
    );
  }

  try {
    let result:
      | Awaited<ReturnType<typeof authenticateAdmin>>
      | Awaited<ReturnType<typeof authenticateDepartment>>
      | Awaited<ReturnType<typeof authenticateSchool>>;

    switch (payload.role) {
      case "admin":
        result = await authenticateAdmin(payload);
        break;
      case "department":
        result = await authenticateDepartment(payload);
        break;
      case "school":
        result = await authenticateSchool(payload);
        break;
      default:
        return NextResponse.json(
          { ok: false, error: "Unknown role." },
          { status: 400 }
        );
    }

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status ?? 400 }
      );
    }

    return NextResponse.json({ ok: true, role: payload.role, ...result.data });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { ok: false, error: "Authentication service unavailable." },
      { status: 500 }
    );
  }
}

