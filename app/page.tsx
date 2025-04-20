import { redirect } from "next/navigation"

export default function Home() {
  // This will only run on the server
  redirect("/en")
}
