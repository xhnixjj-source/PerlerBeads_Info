import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const googleEnabled =
    Boolean(process.env.GOOGLE_CLIENT_ID?.trim()) && Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim());
  const facebookEnabled =
    Boolean(process.env.FACEBOOK_CLIENT_ID?.trim()) && Boolean(process.env.FACEBOOK_CLIENT_SECRET?.trim());

  return <LoginForm googleEnabled={googleEnabled} facebookEnabled={facebookEnabled} />;
}
