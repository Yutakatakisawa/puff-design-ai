import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/auth-store";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: "メールアドレスを入力してください" },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { ok: false, error: "パスワードを入力してください" },
        { status: 400 }
      );
    }

    const result = await verifyUser(email, password);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      user: result.user,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "エラーが発生しました" }, { status: 500 });
  }
}
