import { redirect } from "next/navigation";

// Varsayılan kafe — ana URL'e girince /demo'ya yönlendir
export default function HomePage() {
  redirect("/demo");
}
