import { signOut } from "@/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  await signOut({ redirectTo: `/invitations/${token}` });
}
