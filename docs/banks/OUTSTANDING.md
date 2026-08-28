# Outstanding platform gaps, found by the bank critics

These are defects in the platform that were surfaced while writing the eight
question banks. None can be fixed in a bank, and each blocks at least one
instrument from shipping honestly.

## ~~1. A `multi` cannot express an exclusive option~~ — SHIPPED

**Closed 2026-08-27.** `MultiItem` now carries `exclusive?: string[]`, the option
values that cannot coexist with any other, and `StanceBlock` carries `exclusive`
for its own question and `groundsExclusive` for its grounds multi, both passed
through by `stanceItems`. In the control, ticking an exclusive value replaces the
whole selection with it, ticking any other value drops every exclusive one, and
the `max` cap neither counts an escape nor disables one — so a reader who has
spent every pick and then decides none of them are true can still say so in one
click. `validate()` refuses an `exclusive` value that is not among the item's own
options, a multi whose every option is exclusive (a `choice` wearing the wrong
kind), and `exclusive` on any other kind; `stanceItems` refuses the same
misdeclarations at block level, where the field would otherwise reach no item at
all and the author would believe a restriction was in force. `scoreStances` was
left alone as predicted. The four banks listed here can now write their escapes
honestly, and `boundaries`' `friend-rude` can go back to being a multi. Covered by
`test/core/stance.test.ts` and `test/core/inventory-platform.test.ts`, the second
of which also exercises the control's rule directly — `nextSelection` and
`selectionAtCap` are exported as pure functions so the repo can check them in Node
without a DOM.

## 2. A blank `multi` cannot be told from a skipped one

`scoreStances` reads an untouched multi and a deliberately-empty one both as
`choice: null`, and `runner.tsx` treats every non-`text` item whose answer is
`undefined` as blocking. So "I have not worked that out" can only be inferred
from an absence that also means "I got bored".

`good-life` paid for this with a bank slot — `money-for` carries an explicit
"I have not decided" option, bought by cutting a block. That is the right
short-term answer and it does not generalise: every multi in every inventory
pays the same tax.

Not blocking. Worth solving properly if a second instrument has to buy the same
option twice.

## 3. `good-life` needs plain items alongside stance blocks

Its `openItems` are four `text` items in an `open` section with no closed
answer — a letter to yourself at seventy, and three more. `stanceItems` only
expands `choice` and `multi` blocks, so the instrument's `form()` must
concatenate `stanceItems(...)` with its own hand-written `text` items.

That works today with no core change: `registry.validate()` already requires
every `text` item to carry `tier: "private"`, which is what these want anyway.
Recorded so the implementer does not go looking for a mechanism that is not
needed.
