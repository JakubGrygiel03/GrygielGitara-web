import { redirect } from "next/navigation";

import { FREE_GUIDE_HREF } from "@/lib/free-guide";

/** Legacy URL — canonical offer is FREE_GUIDE_HREF. */
export default function PobierzPoradnikRedirectPage() {
  redirect(FREE_GUIDE_HREF);
}
