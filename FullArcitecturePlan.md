# Full Architecture Plan — Folder Structure + Per-File Detail

---

## PART 1 — COMPLETE FOLDER STRUCTURE

```
app/
 ┣ dashboard/page.tsx                         (role redirect, already planned)
 ┣ pending-approval/page.tsx
 ┣ not-approved/page.tsx
 ┣ no-cohort/page.tsx
 ┣ cohorts/[cohortSlug]/
 ┃  ┣ page.tsx                                (mentee/mentor landing)
 ┃  ┣ pod/[podId]/page.tsx
 ┃  ┣ mentees/[menteeId]/page.tsx
 ┃  ┣ assignments/page.tsx
 ┃  ┣ courses/[courseId]/page.tsx
 ┣ admin/
 ┃  ┣ pulse/page.tsx                          (PM landing)
 ┃  ┣ escalations/page.tsx                    (Associate landing)
 ┃  ┣ cohorts/page.tsx
 ┃  ┣ mentors/page.tsx
 ┃  ┣ users/page.tsx                          (pending approvals)
 ┃  ┣ analytics/page.tsx
 ┣ layout.tsx                                  (wraps all providers)

providers/
 ┣ theme-provider.tsx
 ┣ query-provider.tsx
 ┣ session-provider.tsx
 ┣ approval-gate.tsx
 ┗ realtime-provider.tsx                       (NEW — see below)

store/
 ┣ session-store.ts
 ┣ ui-store.ts
 ┗ filter-store.ts                             (NEW)

lib/
 ┣ supabase/
 ┃  ┣ client.ts
 ┃  ┣ server.ts
 ┃  ┗ middleware.ts
 ┣ permissions.ts
 ┣ query-keys.ts
 ┣ query-client.ts
 ┣ notif-actions-config.ts                     (NEW)
 ┗ api/
    ┣ users.ts
    ┣ cohorts.ts
    ┣ pods.ts
    ┣ mentorships.ts
    ┣ assignments.ts
    ┣ checkins.ts
    ┣ escalations.ts
    ┣ meetings.ts
    ┣ conversations.ts
    ┣ messages.ts
    ┣ notifications.ts
    ┣ courses.ts
    ┗ uploads.ts

hooks/
 ┣ use-cohort.ts
 ┣ use-pod.ts
 ┣ use-mentorships.ts
 ┣ use-mentee-roster.ts
 ┣ use-assignments.ts
 ┣ use-assignment-dispatch.ts
 ┣ use-checkins.ts
 ┣ use-escalations.ts
 ┣ use-meetings.ts
 ┣ use-conversations.ts
 ┣ use-messages.ts
 ┣ use-notifications.ts
 ┣ use-courses.ts
 ┣ use-course-updates.ts
 ┣ use-uploads.ts
 ┣ use-filters.ts
 ┗ use-global-search.ts

components/
 ┣ shell/
 ┃  ┣ AppShell.tsx
 ┃  ┣ Sidebar.tsx
 ┃  ┣ BottomNav.tsx
 ┃  ┣ NavConfig.ts
 ┃  ┣ TopBar.tsx
 ┃  ┗ GlobalSearch.tsx
 ┣ chat/
 ┃  ┣ ChatPanel.tsx
 ┃  ┣ ConversationList.tsx
 ┃  ┣ ConversationListItem.tsx
 ┃  ┣ ConversationTargetPicker.tsx
 ┃  ┣ MessageThread.tsx
 ┃  ┣ MessageBubble.tsx
 ┃  ┣ MessageComposer.tsx
 ┃  ┗ RoleChip.tsx
 ┣ notifications/
 ┃  ┣ NotificationBell.tsx
 ┃  ┣ NotificationPanel.tsx
 ┃  ┣ NotificationCard.tsx
 ┃  ┗ NotificationTypeChip.tsx
 ┣ filters/
 ┃  ┣ FilterBar.tsx
 ┃  ┣ FilterChip.tsx
 ┃  ┗ DateRangePicker.tsx
 ┣ analytics/
 ┃  ┣ AnalyticsPanel.tsx
 ┃  ┣ StatCard.tsx
 ┃  ┣ CompletionBar.tsx
 ┃  ┗ IncompleteList.tsx
 ┣ cohort/
 ┃  ┣ CohortCard.tsx
 ┃  ┣ CohortDetail.tsx
 ┃  ┗ CreateCohortForm.tsx
 ┣ pod/
 ┃  ┣ PodCard.tsx
 ┃  ┣ PodDetail.tsx
 ┃  ┗ CreatePodForm.tsx
 ┣ people/
 ┃  ┣ MenteeCard.tsx
 ┃  ┣ MenteeDetail.tsx
 ┃  ┣ MentorRoster.tsx
 ┃  ┗ MenteeSelector.tsx
 ┣ assignments/
 ┃  ┣ AssignmentTemplateForm.tsx
 ┃  ┣ AssignmentDispatchForm.tsx
 ┃  ┣ AssignmentList.tsx
 ┃  ┣ AssignmentCard.tsx
 ┃  ┗ SubmissionBox.tsx
 ┣ checkins/
 ┃  ┣ CheckInList.tsx
 ┃  ┗ CheckInForm.tsx
 ┣ escalations/
 ┃  ┣ EscalationDesk.tsx
 ┃  ┣ EscalationCard.tsx
 ┃  ┗ EscalationNoteForm.tsx
 ┣ meetings/
 ┃  ┣ CreateMeetingForm.tsx
 ┃  ┣ MeetingCard.tsx
 ┃  ┗ MeetingList.tsx
 ┣ courses/
 ┃  ┣ CourseList.tsx
 ┃  ┣ CourseCard.tsx
 ┃  ┣ CourseForm.tsx
 ┃  ┣ CourseDetail.tsx
 ┃  ┣ CourseLinksEditor.tsx
 ┃  ┣ CourseUpdateTimeline.tsx
 ┃  ┣ CourseUpdateForm.tsx
 ┃  ┗ MessageMenteeAboutCourseButton.tsx
 ┣ admin/
 ┃  ┣ PendingApprovalsList.tsx
 ┃  ┗ PendingApprovalCard.tsx
 ┗ shared/
    ┣ FileOrLinkInput.tsx
    ┣ EmptyState.tsx
    ┣ Skeletons.tsx
    ┣ Avatar.tsx
    ┣ RoleBadge.tsx
    ┣ Tag.tsx
    ┣ Btn.tsx
    ┣ Card.tsx
    ┣ SectionLabel.tsx
    ┗ Divider.tsx
```

---

## PART 2 — PROVIDERS

### `providers/theme-provider.tsx`
Wraps `next-themes`. No backend dependency. Reads/writes `localStorage` only. Controls `.dark` class on `<html>` which drives the whole `globals.css` token system (surface/text-accent/etc). Nazaria brand note: when dark mode is active, any raw logo usage elsewhere must get the `bg-white rounded-full p-2` wrap — this provider doesn't handle that, just flags it for whichever component renders the logo.

### `providers/query-provider.tsx`
As given in your example — no changes needed. One addition: `makeQueryClient()` in `lib/query-client.ts` should set `staleTime: 30_000` as a sane default and `retry: 1` (not the TanStack default of 3, which is too slow to fail visibly on an RLS permission error).

### `providers/session-provider.tsx`
As given — this is correct. One addition worth calling out: after `hydrate()` sets the session, `permissionLevel` (mentee/mentor/staff) should be computed here too via `lib/permissions.ts` and stored alongside `role`, so downstream components read `permissionLevel` instead of re-deriving it from `role` everywhere.

### `providers/approval-gate.tsx`
**New responsibility, not shown in your example — needs writing.** Reads `approvalStatus` from `useSessionStore`. If `pending` → redirect `/pending-approval`. If `rejected` → redirect `/not-approved`. Renders `children` otherwise. Sits **inside** `SessionProvider` (needs hydrated session) and **outside** page content in `layout.tsx`.
- UI/UX: no visible UI itself — pure redirect logic. The two target pages (`/pending-approval`, `/not-approved`) are simple centered-card static pages, Nazaria brand shell (logo + message + contact `us@nazariacollective.in`), no data fetching needed beyond the session already loaded.
- Backend: none beyond what `SessionProvider` already fetched (`users.approval_status`).

### `providers/realtime-provider.tsx`
**New — not in your original 4, but required for Phase 11 (chat/notifications realtime).**
- Purpose: opens exactly **two** long-lived Supabase Realtime channels per logged-in user — one for `user_notifications` filtered by `user_id`, one for `messages` filtered by the user's active `conversation_id`s — and invalidates the matching React Query keys on INSERT.
- Why a provider and not per-hook subscriptions: if `use-messages.ts` and `use-notifications.ts` each open their own channel independently, you get duplicate socket connections per mounted component (e.g., `ChatPanel` open + `NotificationBell` mounted = 2 sockets each). Centralizing in one provider means one subscription per concern, mounted once at the shell level, regardless of how many components care about the data.
- Backend requirement: `messages` and `user_notifications` tables must have Realtime replication enabled (Phase 11 checklist item already covers this).
- No visible UI. Sits inside `SessionProvider` (needs `user.id`) and inside `QueryProvider` (needs `queryClient` to call `.invalidateQueries`).

### `store/filter-store.ts` (companion to providers, global like session/ui)
```ts
type FilterState = {
  cohortId?: string; podId?: string; mentorId?: string; menteeId?: string;
  dateRange?: { from: string; to: string }; status?: string;
  setFilter: (patch: Partial<FilterState>) => void; clear: () => void;
};
```
Zustand store, ephemeral only (never persisted, never holds server data — same rule as `ui-store`). Every list/analytics hook reads from this via `useFilterStore()` and passes the relevant subset into its query key so caching stays correct per filter combination.

---

## PART 3 — SHELL

### `components/shell/AppShell.tsx`
- **Props:** `role: PermissionLevel`, `navItems: NavItem[]`, `activePage: string`, `onNavigate: (id) => void`, `pageTitle: string`, `headerExtra?: ReactNode`, `children`.
- **UI/UX:** Desktop → 56px icon sidebar, left. Mobile (<768px) → bottom tab bar, icons only, active tab gets `--color-accent` fill per the token system (or Nazaria `text-accent`/`surface-muted` if you migrate off the dark dashboard palette onto the Nazaria brand tokens — decide once, don't mix both palettes). Top bar: page title (left), `GlobalSearch` (center/collapsible on mobile), `NotificationBell`, Messages button, avatar (right).
- **State:** reads `chatOpen`/`notifOpen` from `ui-store`, renders `<ChatPanel/>` / `<NotificationPanel/>` conditionally, does not own their internal state.
- **Backend:** none directly — delegates to children. Reads `useUnreadNotifCount()` and `useUnreadMessageCount()` hooks for badge counts only.

### `components/shell/Sidebar.tsx` / `BottomNav.tsx`
- Pure presentational, receive `navItems` + `activePage` + `onNavigate` from `AppShell`. No data fetching. `NavConfig.ts` exports `NAV_BY_PERMISSION: Record<PermissionLevel, NavItem[]>` (icon, label, id, badgeKey?) — `badgeKey` optionally points to a count (e.g. unreviewed escalations for Associate nav).

### `components/shell/GlobalSearch.tsx`
- **UI/UX:** input with `⌘K`/`/` shortcut, opens a small results dropdown grouped by type (Mentees, Assignments, Courses, Cohorts) — max 3–5 per group, "see all" link if more.
- **State:** debounced input (300ms) → `useGlobalSearch(query)`.
- **Backend:** a single Postgres function or `.or()` filter query across `users.full_name` (mentee/mentor), `assignments.title`, `external_courses.title`, `cohorts.name`, scoped by the caller's `permissionLevel` (mentee sees only their own pod/cohort scope; staff sees everything). Needs `pg_trgm` extension + a trigram index on `full_name`/`title` if search needs to be fast and fuzzy — flag this as a migration if you want typo-tolerant search, otherwise a plain `ilike '%query%'` is fine for MVP.

---

## PART 4 — CHAT

### `components/chat/ChatPanel.tsx`
- **Props:** `initialConversationId?: string` (used when opened from a "Message" button elsewhere).
- **UI/UX:** right-side drawer, fixed width ~380–420px desktop, full-screen overlay on mobile. Two-pane: `ConversationList` (left, ~150px) + `MessageThread` (right, flex).
- **State:** `activeConversationId` local state, defaults to `initialConversationId` or first conversation.
- **Backend:** none directly — composes children.

### `components/chat/ConversationList.tsx`
- **UI/UX:** list of `ConversationListItem`s, grouped visually by type (Staff-only 🔒 / Cohort 🏛️ / Pod 👥 / Direct 👤). Unread conversations bold + dot indicator. "+ New" button opens `ConversationTargetPicker`.
- **Backend:** `useConversations()` → 
  ```sql
  select c.*, cp.last_read_at,
    (select count(*) from messages m where m.conversation_id = c.id and m.created_at > cp.last_read_at) as unread_count
  from conversations c
  join conversation_participants cp on cp.conversation_id = c.id
  where cp.user_id = auth.uid()
  order by c.last_message_at desc nulls last
  ```

### `components/chat/ConversationListItem.tsx`
- **Props:** `conversation`, `active: boolean`, `onClick`.
- Purely presentational: icon by type, name, last message preview (truncated, needs `messages` last row — either denormalize `last_message_preview` onto `conversations` or fetch via a join; denormalizing is cheaper at read time and worth a migration column).

### `components/chat/ConversationTargetPicker.tsx`
- **UI/UX:** modal/sheet with search input + role-grouped list of selectable people, single-select (starts a direct conversation) — group creation (pod/cohort broadcast) is staff-only and shown as separate large buttons above the person list ("Message my pod", "Message my cohort") rather than manual multi-select, since those conversations already exist as standing channels.
- **Backend:** list source is `useMentorships()`/`useMenteeRoster()` filtered through `canMessage(fromRole, toRole)` from `lib/permissions.ts` **before** rendering — never render a target the backend would reject. On select: `useCreateConversation()` mutation — checks for an existing direct conversation between the two users first (avoid duplicate DMs), else inserts `conversations` + two `conversation_participants` rows.

### `components/chat/MessageThread.tsx`
- **Props:** `conversationId`.
- **UI/UX:** scrollable message list, auto-scrolls to bottom on new message, "jump to latest" button appears if scrolled up. Loads most recent 30, "load older" on scroll-to-top (pagination via `created_at` cursor).
- **Backend:** `useMessages(conversationId)` — realtime-subscribed (via `realtime-provider`), invalidated on INSERT filtered by `conversation_id`. On mount, also fires `useMarkConversationRead()` mutation → updates `conversation_participants.last_read_at`.

### `components/chat/MessageBubble.tsx`
- **Props:** `message`, `isSelf: boolean`, `showSender: boolean` (false for consecutive messages from the same sender, WhatsApp-style).
- **UI/UX:** self messages right-aligned + accent background; others left-aligned + card background, sender name + `RoleChip` shown only when `showSender`, timestamp below in muted small text (`fmtTime`).

### `components/chat/MessageComposer.tsx`
- **Props:** `conversationId`, `canMessage: boolean`, `disabledReason?: string`.
- **UI/UX:** text input + send button, `Enter` to send / `Shift+Enter` newline. If `canMessage === false`, input is disabled and replaced with a muted banner showing `disabledReason` (e.g. "Messaging is limited to your direct mentor/mentee").
- **Backend:** `useSendMessage()` mutation → inserts into `messages`, triggers `last_message_at` update on `conversations` (via trigger or app-level second update — pick one, document it, same pattern as Phase 14 notification triggers).

### `components/chat/RoleChip.tsx`
Tiny shared atom — colored pill per role (mentor/mentee/associate/pm), used inside `MessageBubble`, `MenteeCard`, `EscalationCard`, anywhere a person's role needs to be visible at a glance. No backend — pure prop-driven (`role: string`).

---

## PART 5 — NOTIFICATIONS

### `components/notifications/NotificationBell.tsx`
- **UI/UX:** icon button in `TopBar`, red dot badge (no count number — matches your existing demo style) when `unreadCount > 0`. Click toggles `ui-store.notifOpen`.
- **Backend:** `useUnreadNotifCount()` — `select count(*) from user_notifications where user_id = auth.uid() and read_at is null`.

### `components/notifications/NotificationPanel.tsx`
- **UI/UX:** right drawer (or full sheet mobile). Tabs: All / Assignments / Check-ins / Meetings / Messages / Other (matches your original clustering plan). "Mark all read" top-right, only shown when unread > 0.
- **Backend:** `useNotifications()` joins `user_notifications` + `notifications`, ordered `created_at desc`, paginated (limit 20 + load more).

### `components/notifications/NotificationCard.tsx`
- **Props:** `notification`.
- **UI/UX:** icon (from `NotificationTypeChip`), title, body, relative timestamp, unread = left accent border + slightly elevated background (matches your existing pattern). **One primary action button**, computed via `notifActionsConfig.ts` lookup by `type`. Overflow `⋮` menu holds "Mark as read"/"Mark as done"/"Dismiss" — only the ones valid for that type.
- **Backend:** primary action navigates with prefill params (e.g. `/checkins/new?mentorshipId=X`) or calls a mutation directly (`useMarkNotifRead()`); "mark as done" for `assignment_due` type calls the same `useSubmitAssignment` deep link, it doesn't have its own mutation.

### `lib/notif-actions-config.ts`
```ts
export const NOTIF_ACTIONS: Record<NotifType, {
  icon: string;
  primary?: { label: string; href: (n: Notification) => string };
  secondary?: ("markRead" | "markDone" | "dismiss")[];
}> = {
  meeting:              { icon: "📅", primary: { label: "Join meeting", href: n => n.meeting?.meet_link ?? `/meetings/${n.meeting_id}` }, secondary: ["markRead"] },
  assignment_due:       { icon: "⏰", primary: { label: "Go to assignment", href: n => `/assignments/${n.mentee_assignment_id}` }, secondary: ["markRead", "markDone"] },
  assignment_submitted: { icon: "✅", primary: { label: "Review", href: n => `/assignments/${n.mentee_assignment_id}` }, secondary: ["markRead"] },
  check_in_escalation:  { icon: "🚨", primary: { label: "Open escalation", href: n => `/admin/escalations?checkInId=${n.check_in_id}` }, secondary: ["markRead"] },
  check_in_reminder:    { icon: "🔔", primary: { label: "Log check-in", href: n => `/checkins/new?mentorshipId=${n.meta?.mentorshipId}` }, secondary: ["markRead", "markDone"] },
  course_update:        { icon: "📚", primary: { label: "View course", href: n => `/courses/${n.meta?.courseId}` }, secondary: ["markRead"] },
  message:              { icon: "✉️", primary: { label: "Open chat", href: n => `/messages/${n.meta?.conversationId}` }, secondary: ["markRead"] },
};
```
This single config file is what keeps `NotificationCard` free of if/else branching — every new notification type is a config entry, not a code change to the card.

---

## PART 6 — FILTERS & ANALYTICS

### `components/filters/FilterBar.tsx`
- **Props:** `visibleFilters: ("cohort" | "pod" | "mentor" | "mentee" | "dateRange" | "status")[]` — caller declares which controls are relevant to its own page.
- **UI/UX:** horizontal row of dropdown chips, each opens a small popover. Active filters show as removable `FilterChip`s. "Clear all" appears once ≥1 filter is active.
- **Backend:** cohort/pod/mentor dropdown options come from lightweight list queries (`useCohorts()`, `usePodsForCohort()`, `useMentorRoster()`) — these should be separate, cheap, cached-long queries (`staleTime: 5min`), not re-derived from the full dataset being filtered.

### `components/analytics/AnalyticsPanel.tsx`
- **Props:** `scope: "assignments" | "checkins" | "escalations"`, reads `useFilterStore()` internally.
- **UI/UX:** grid of `StatCard`s (completion %, count, trend) + one `CompletionBar` + an `IncompleteList` below (the "what's not done yet" list, e.g. mentees with no check-in this week).
- **Backend:** per scope, a dedicated aggregate query (ideally a Postgres view or RPC function — e.g. `assignment_completion_by_pod(cohort_id, pod_id)` — rather than pulling all rows client-side and reducing in JS, which won't scale and will leak data across RLS boundaries awkwardly). Recommend adding 2–3 SQL views: `v_assignment_completion`, `v_checkin_completion`, `v_escalation_stats`, each pre-joined and RLS-inherited from base tables, queried with the same `FilterState` params.

### `components/analytics/IncompleteList.tsx`
- **Props:** `items: { id, label, subtitle, dueOrOverdueLabel }[]`, `onItemClick`.
- Generic — same component renders "mentees with no check-in" or "overdue assignments" or "unreviewed escalations" depending on what array it's given. Keeps this from being three separate list components.

---

## PART 7 — COHORT / POD / PEOPLE

### `components/cohort/CohortCard.tsx`
- **Props:** `cohort`.
- **UI/UX:** name, date range, status pill, week progress bar (`week_number/total_weeks`), "Message" + "View details" buttons.
- **Backend:** none itself — data passed in from `useCohorts()`/`useCohort(id)`.

### `components/cohort/CohortDetail.tsx`
- **UI/UX:** header (same info as card, larger) + pods grid (`PodCard` list) + description.
- **Backend:** `useCohort(id)` + `usePodsForCohort(id)`.

### `components/pod/PodCard.tsx`
- **UI/UX:** pod name, mentor name + avatar, mentee count, skill level tag, "Message" + "View details" (→ `/pod/[podId]`) buttons.
- **Backend:** data passed from `usePods()`/`usePod(id)`.

### `components/pod/PodDetail.tsx` (`/pod/[podId]`)
- **UI/UX:** pod header, member list (mentor pinned top, then `MenteeCard` list, `variant="compact"`, `context="pod"`), pod chat shortcut, pod sessions list.
- **Backend:** `usePod(id)` (joins `pod_members` + `users` + `cohort_members` for role), `useMeetingsForPod(id)`.

### `components/people/MenteeCard.tsx`
- **Props:** `mentee`, `variant: "compact" | "expanded"`, `context: "pod" | "roster" | "mentorship"`.
- **UI/UX:** `compact` = single row (avatar, name, role chip, one stat relevant to context — e.g. last check-in tone in pod context, assignment completion % in roster context), click expands in place or navigates depending on context. `expanded` = square-ish card, larger avatar, bio snippet, 2–3 stat tiles, "Message" + "View details" (→ `/mentees/[id]`) + (mentor/staff only) "Schedule meeting" button that opens `CreateMeetingForm` with `menteeId` prefilled.
- **Backend:** no fetching itself — receives mentee object from whichever parent hook fits the context (`usePod`, `useMenteeRoster`, `useMentorships`).

### `components/people/MenteeDetail.tsx` (`/mentees/[menteeId]`)
- **UI/UX:** profile header (avatar, name, school/org, bio, goals/interests tags) + tabbed sections: Assignments, Check-ins, Escalation history, Courses. "Message" button top-right (opens direct chat). Visible to: mentor of that mentee, or any staff.
- **Backend:** `permissions.canViewMenteeDetail(viewer, menteeId)` gate before fetch. Pulls from `useAssignments({menteeId})`, `useCheckIns({menteeId})`, `useEscalations({menteeId})`, `useCourses({menteeId})` — all reusing the same hooks as elsewhere, just scoped by `menteeId` filter.

### `components/people/MentorRoster.tsx`
- **UI/UX:** for staff — full mentor list with expandable mentee sub-lists (same collapsible pattern as your old `PageMentors`). For mentors — n/a (they see their own pod only via `PodDetail`).
- **Backend:** `useMentorRoster()` (staff-only query, `permissionLevel === "staff"` required by `lib/permissions.ts`).

### `components/people/MenteeSelector.tsx`
- **Props:** `value: string[]` (selected mentee ids), `onChange`, `scope?: { cohortId?, podId? }` (constrains the selectable pool — e.g. a mentor creating a meeting only sees their own pod).
- **UI/UX:** search input + filter chips (cohort/pod) + checkbox list + "select all (matching filter)" + selected count footer. Used inside `CreateMeetingForm`, `CreatePodForm`, `AssignmentDispatchForm`.
- **Backend:** `useMenteeRoster(scope)` — same underlying hook as `MentorRoster`/`MenteeDetail`, just called with a narrower scope object, per the "every hook takes explicit scope" rule from your original Phase 7 plan.

---

## PART 8 — ASSIGNMENTS

### `components/assignments/AssignmentTemplateForm.tsx`
- **Props:** `mode: "create" | "edit"`, `initialValues?`.
- **UI/UX:** title, description, instructions (rich-ish textarea), category select, week number, `starts_at`/`locks_at` date fields, `FileOrLinkInput` list for provided reference files. If `mode === "edit"` and `now() > locks_at`, all fields render read-only with a banner: "This assignment has started and can no longer be edited."
- **Backend:** `useCreateAssignmentTemplate()` / `useUpdateAssignmentTemplate()` — staff only (`canDispatchAssignment` gate at minimum, template CRUD itself may be staff-only, stricter than dispatch). Soft delete via `useDeleteAssignmentTemplate()` sets `deleted_at`, never a hard delete.

### `components/assignments/AssignmentDispatchForm.tsx`
- **Props:** `assignmentId` (picks from existing templates via a searchable select), `defaultScope?`.
- **UI/UX:** pick template → pick scope (radio: single mentee / pod / cohort) → if scope needs specific people, embeds `MenteeSelector` → due date picker → "Dispatch" button showing "This will assign to N mentees."
- **Backend:** `useCreateAssignmentDispatch()` — inserts one `assignment_dispatches` row + fans out N `mentee_assignments` rows (best done as a single RPC/transaction, not N client-side inserts, to avoid partial-fan-out on failure). Fires `assignment_due` notification per Phase 14 (scheduled job handles the "due soon" reminder separately — dispatch itself doesn't need to notify immediately unless you want an "assigned" notification too, which is a reasonable addition to `notifications.type`).

### `components/assignments/AssignmentList.tsx`
- **Props:** `scope`, `viewerRole`.
- **UI/UX:** mentee view = "Pending" / "Submitted" sections (as in your old dashboard). Mentor/staff view = flat sortable/filterable table-ish list (uses `FilterBar` with `visibleFilters=["pod","status"]`) showing per-mentee submission status, click row → expands `AssignmentCard` inline or navigates to a review pane.
- **Backend:** `useAssignments(scope)`.

### `components/assignments/AssignmentCard.tsx`
- **Props:** `menteeAssignment`, `viewerRole: "mentee" | "mentor" | "staff"`.
- **UI/UX:** collapsed = title, category tag, due-state pill (color-coded: upcoming/due-soon/overdue/submitted/reviewed, same logic as your old demo). Expanded = description/instructions/reference files, then **role-branched footer**: mentee sees `SubmissionBox`; mentor/staff sees submission link/file + "Mark reviewed" button + optional feedback textarea.
- **Backend:** `useSubmitAssignment()` (mentee), `useReviewAssignment()` (mentor/staff, sets `is_checked`/`checked_at`/`checked_by`).

### `components/assignments/SubmissionBox.tsx`
- **Props:** `menteeAssignmentId`.
- **UI/UX:** collapsed "Submit work" button → expands to `FileOrLinkInput` + optional note textarea + Submit/Cancel.
- **Backend:** on submit, calls `useUploadFile()` (if file chosen) then `useSubmitAssignment()` which inserts `mentee_submissions` + flips `mentee_assignments.is_submitted`/`submitted_at`, and fires `assignment_submitted` notification (Phase 14, same as before).

---

## PART 9 — CHECK-INS

### `components/checkins/CheckInList.tsx`
- **Props:** `scope`, `viewerRole`.
- **UI/UX:** mentor view = create button + reverse-chron list, tone dot + date + snippet, click expands full `goals_discussed`. Staff view = read-only, triage-oriented (surfaces `escalation_flag = true` rows first, visually distinct).
- **Backend:** `useCheckIns(scope)` — note: `raw_notes`/`ai_structured` are mentor/staff-only fields, must never be requested in a query that a mentee-scoped hook could theoretically call (enforce via RLS in Phase 15, but also just don't `select *` from a mentee-facing hook).

### `components/checkins/CheckInForm.tsx`
- **Props:** `mentorshipId`, `initialValues?` (for notification-driven prefill).
- **UI/UX:** emotional tone select (icon+label per tone, matches `TONE_COLOR` map), goals discussed textarea, raw notes textarea (mentor-private, labeled "Private notes — not visible to mentee"), escalation toggle ("Flag for staff review") which reveals a required short reason field when on.
- **Backend:** `useCreateCheckIn()` — if `escalation_flag = true`, this insert is also what should trigger the `check_in_escalation` notification (app-level insert in the same mutation, or a DB trigger — pick one per Phase 14's own instruction to document the choice).

---

## PART 10 — ESCALATIONS

### `components/escalations/EscalationDesk.tsx`
- **UI/UX:** filter tabs (all/unreviewed/reviewed/actioned) with counts, list of `EscalationCard`. Staff-only page.
- **Backend:** `useEscalations()` — joins `check_ins` + `mentee`/`mentor` user rows, filtered `escalation_flag = true`.

### `components/escalations/EscalationCard.tsx`
- **UI/UX:** mentee avatar/name/pod/mentor, tone tag, status tag, the `escalation_reason`/`goals_discussed` shown in a highlighted block, existing `associate_note` shown if present (with author + timestamp), then `EscalationNoteForm` if not yet actioned.
- **Backend:** props-driven, no direct fetch.

### `components/escalations/EscalationNoteForm.tsx`
- **Props:** `checkInId`, `stage: "review" | "action"`.
- **UI/UX:** textarea + one button ("Mark reviewed" or "Mark actioned" depending on `stage`).
- **Backend:** `useResolveEscalation()` — updates `check_ins.associate_note`, and correctly sets **either** `reviewed_by`/`reviewed_at` **or** `actioned_by`/`actioned_at` depending on `stage`, always using `auth.uid()` server-side (never trust a client-passed user id for these columns — enforce via RLS write policy restricting who can set them).

---

## PART 11 — MEETINGS

### `components/meetings/CreateMeetingForm.tsx`
- **Props:** `initialValues?: { menteeIds?, title?, mentorshipId? }` (prefill from `MenteeCard`'s "Schedule meeting" button or a notification deep-link).
- **UI/UX:** title, description, date/time range pickers, meet link input (plain text field for now, per your MVP note — "later auto-generate via Google Meet API"), `MenteeSelector` for attendees (scope-limited to mentor's own pod, or unrestricted for staff), recurrence option (uses `meeting_series` table — one-time vs weekly/biweekly).
- **Backend:** `useCreateMeeting()` — inserts `meetings` (+ `meeting_series` if recurring) + N `meeting_participants` rows, fires `meeting` notification to every participant (Phase 14).

### `components/meetings/MeetingCard.tsx` / `MeetingList.tsx`
- **UI/UX:** upcoming vs past sections (as in your old dashboard demo), "Join" button (only shown if `meet_link` present and status scheduled + within a reasonable time window), notes shown for past/completed meetings.
- **Backend:** `useMeetings(scope)`.

---

## PART 12 — COURSES

### `components/courses/CourseList.tsx`
- **Props:** `scope`, `viewerRole`.
- **UI/UX:** mentee = own courses grid + "+ Add course". Mentor = active mentees' courses grouped by mentee name, read-only. Staff = all mentees' courses, same grouping, `FilterBar` with `visibleFilters=["cohort","pod","status"]`.
- **Backend:** `useCourses(scope)` — queries `external_courses` joined to owning mentee's name.

### `components/courses/CourseCard.tsx`
- **UI/UX:** title, provider, status pill (in_progress/completed/dropped), target end date, small progress indicator (latest `progress_percent` from most recent `course_updates` row, if any), click → `CourseDetail`.

### `components/courses/CourseForm.tsx`
- **UI/UX:** title, provider, url, description, started_at, target_end_date, status select. Owner (mentee) only.
- **Backend:** `useCreateCourse()` / `useUpdateCourse()`, owner check `session.user.id === course.mentee_id` client-side **and** RLS-enforced server-side (per Phase 15).

### `components/courses/CourseDetail.tsx`
- **UI/UX:** header (title/provider/status/dates) + `CourseLinksEditor` + `CourseUpdateTimeline` + (mentor/staff viewing someone else's course) `MessageMenteeAboutCourseButton` instead of the edit controls.
- **Backend:** `useCourses` single-item variant or a dedicated `useCourse(id)`.

### `components/courses/CourseLinksEditor.tsx`
- **Props:** `courseId`, `links: {title,url}[]`, editable only by owner.
- **UI/UX:** simple add/remove row list, inline edit, no separate save step needed if you patch the array on each change (small payload).
- **Backend:** `useUpdateCourse()` patching a `links jsonb` array column (this is the one legitimate array use case — no independent lifecycle per link).

### `components/courses/CourseUpdateTimeline.tsx`
- **Props:** `courseId`.
- **UI/UX:** reverse-chron cards: progress note, optional % slider value shown as a small bar, optional hours spent, optional attachment (`FileOrLinkInput` rendered read-only as a chip/link).
- **Backend:** `useCourseUpdates(courseId)` — real table query, ordered `created_at desc`, soft-delete aware (`deleted_at is null`).

### `components/courses/CourseUpdateForm.tsx`
- **Props:** `courseId`.
- **UI/UX:** progress note textarea (required), % slider (optional), hours spent number input (optional), `FileOrLinkInput` (optional). Owner (mentee) only, staff/mentor never see this form.
- **Backend:** `usePostCourseUpdate()` — inserts `course_updates` row, then fires `course_update` notification to the mentee's active mentor(s) via a `mentorships` join (Phase 13's already-planned trigger).

### `components/courses/MessageMenteeAboutCourseButton.tsx`
- **Props:** `menteeId`, `menteeName`, `courseName`.
- **UI/UX:** button that opens `ChatPanel` with a new/existing direct conversation to that mentee, and **pre-fills** (not sends) `MessageComposer`'s input with: `Hey {menteeName}, this is regarding your course "{courseName}": `.
- **Backend:** reuses `useCreateConversation()` find-or-create logic from `ConversationTargetPicker` — this button is really just a shortcut that pre-selects a target and pre-fills text, not a separate messaging pathway.

---

## PART 13 — ADMIN

### `components/admin/PendingApprovalsList.tsx`
- **UI/UX:** staff-only page/section, list of `PendingApprovalCard`s, empty state "No pending approvals."
- **Backend:** `usePendingUsers()` — `select * from users where approval_status = 'pending' order by created_at asc`.

### `components/admin/PendingApprovalCard.tsx`
- **UI/UX:** name, email, requested role, signup date, Approve / Reject buttons (Reject asks for optional reason, stored nowhere currently — if you want reason tracking, that's a 1-column addition to `users` or a small `approval_events` log table).
- **Backend:** `useApproveUser()` / `useRejectUser()` — updates `users.approval_status`, PM-only per `lib/permissions.ts`.

---

## PART 14 — SHARED PRIMITIVES

### `components/shared/FileOrLinkInput.tsx`
- **Props:** `value`, `onChange`, `accept?: "file" | "link" | "both"`.
- **UI/UX:** toggle/tab between "Paste a link" (plain URL text input) and "Upload a file" (drag-drop or file picker, shows filename + progress bar while uploading, then a chip once done).
- **Backend:** link mode is just a string. Upload mode calls `useUploadFile()` → `POST /api/uploads` (Phase 12 route) → returns `files.id`, which the parent form stores as `file_id`/`link_id` reference on whatever it's attached to (submission, course update, template reference file).

### `components/shared/EmptyState.tsx`
- **Props:** `icon`, `title`, `description?`, `action?: {label, onClick}`.
- Used everywhere a list can be empty — no backend, purely presentational, standardizes the "no data" look across the whole app.

### `components/shared/Skeletons.tsx`
- Exports `CardSkeleton`, `ListRowSkeleton`, `StatSkeleton` — shown while any `useQuery` is `isLoading`, matching each area's real layout so there's no content-shift on load.

---

## PART 15 — BACKEND SURFACE SUMMARY (what every hook ultimately needs)

| Feature | Tables touched | New backend needs |
|---|---|---|
| Chat | conversations, conversation_participants, messages | denormalized `last_message_preview` column (optional); realtime replication |
| Notifications | notifications, user_notifications | realtime replication; `notif-actions-config` is frontend-only |
| Assignments | assignments, assignment_dispatches, mentee_assignments, mentee_submissions, files | `starts_at`/`locks_at` columns; RPC for atomic dispatch fan-out |
| Check-ins | check_ins, mentorships | none beyond existing schema |
| Escalations | check_ins | optional `escalation_notes` table if history needed; RLS write policy restricting `reviewed_by`/`actioned_by` to `auth.uid()` |
| Meetings | meetings, meeting_series, meeting_participants | none beyond existing schema |
| Courses | external_courses, course_updates, files | none — schema already correct |
| Search | users, assignments, external_courses, cohorts | optional `pg_trgm` + trigram indexes |
| Analytics | derived from all above | 2–3 SQL views/RPCs: `v_assignment_completion`, `v_checkin_completion`, `v_escalation_stats` |
| Approvals | users | optional `approval_events` log table if rejection reasons matter |