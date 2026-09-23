import { Link } from "@/components/ui/link";
import { EmptyState } from "@/components/brand/moments";

/*
 * A not-found boundary receives no params, so it cannot know which language
 * it is answering in; its words stay in English, as they were, and Uriel's
 * face says the rest in every language.
 */
export default function NotFound() {
  return (
    <EmptyState
      mood="oops"
      level={1}
      tone="error"
      kicker="404"
      title="This page does not exist"
      action={
        <Link href="/" className="label-caps tap hover:text-ink">
          ← Home
        </Link>
      }
    >
      <p>Oops. My halo slipped. Start again from home.</p>
    </EmptyState>
  );
}
