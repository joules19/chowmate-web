# Email Builder — Planning Notes

## Overview

An in-app drag-and-drop email builder for admins to create promotional email templates, save them, and send to users with basic personalization.

---

## Scope

- **Promotional emails only** — not transactional (no order/delivery context needed)
- Admins build templates visually using a block-based editor
- Templates are saved and reusable
- Only dynamic variable is customer identity (name, email)
- All other content is static, defined in the builder

---

## Builder UI

### Recommended Approach
Embed **Unlayer** (`react-email-editor`) — a white-labelable drag-and-drop editor that outputs clean HTML and a JSON design object.

- Admin builds visually in the browser
- On save: store both the HTML output and the Unlayer JSON (so templates can be re-opened and edited)
- Route: `/control/email-builder`

### Supported Block Types
- Header (logo + brand color bar)
- Text (rich text, emojis, bold, links)
- Image (upload or URL)
- Button (CTA with link)
- Divider
- Spacer
- Footer (unsubscribe link, address, legal)

---

## Dynamic Variables

Only customer-level variables are supported. All others are static content built in the editor.

| Label | Variable | Source |
|---|---|---|
| First Name | `{{firstName}}` | User record |
| Last Name | `{{lastName}}` | User record |
| Email | `{{email}}` | User record |

Variables use **Handlebars syntax** (`{{variableName}}`).

The builder UI exposes a **variable picker dropdown** in the text block toolbar. Clicking inserts the variable token into the current text cursor position.

The email subject line also supports variables (e.g. `Hey {{firstName}}, here's something for you!`).

---

## Template Storage Schema

```
EmailTemplate {
  id
  name           // e.g. "Black Friday Promo"
  subject        // e.g. "Hey {{firstName}}, don't miss this!"
  bodyHtml       // rendered HTML with {{variable}} tokens
  bodyJson       // Unlayer JSON design (for re-editing)
  category       // "promotional" (only type for now)
  createdBy      // admin user ID
  createdAt
  updatedAt
}
```

---

## Backend Send Flow

At send time, the backend:

1. Fetches the template by ID
2. Iterates over the list of recipient user IDs
3. For each recipient, fetches their user record and resolves variables
4. Renders HTML and subject via Handlebars
5. Sends via the configured email provider (Resend / SendGrid / SES)

```ts
async function sendPromoEmail(templateId: string, recipientIds: string[]) {
  const template = await db.emailTemplate.findUnique({ where: { id: templateId } });

  for (const userId of recipientIds) {
    const user = await db.user.findUnique({ where: { id: userId } });

    const html = Handlebars.compile(template.bodyHtml)({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });

    const subject = Handlebars.compile(template.subject)({
      firstName: user.firstName,
    });

    await emailProvider.send({ to: user.email, subject, html });
  }
}
```

> For large recipient lists, wrap sends in a job queue (e.g. BullMQ) rather than a raw loop.

---

## Admin Send Flow (UI)

1. Admin opens `/control/email-builder`
2. Selects an existing template or creates a new one
3. Edits visually in the Unlayer canvas
4. Saves template (name + subject + HTML + JSON stored to backend)
5. To send: picks template → selects audience (all users / specific segment) → previews rendered email → confirms send

---

## Open Questions

- [ ] Which email provider is Chowmate using? (Resend, SendGrid, AWS SES?)
- [ ] Is there a job queue (BullMQ etc.) set up for bulk sends?
- [ ] Should sent emails be logged (for audit / re-send tracking)?
- [ ] Do we need an unsubscribe / opt-out mechanism?
