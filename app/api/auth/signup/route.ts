import { NextResponse } from "next/server";
import { createUser } from "@/lib/auth-store";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; name?: string; password?: string };
    const { email, name, password } = body;

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
    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "パスワードは6文字以上にしてください" },
        { status: 400 }
      );
    }

    const result = await createUser(email, (name as string) || "", password);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: "登録が完了しました" });
  } catch {
    return NextResponse.json({ ok: false, error: "エラーが発生しました" }, { status: 500 });
  }
}
