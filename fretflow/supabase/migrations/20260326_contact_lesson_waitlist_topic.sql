-- Allow contact form topic: lesson waitlist.

alter table public.contact_messages
  drop constraint if exists contact_messages_topic_check;

alter table public.contact_messages
  add constraint contact_messages_topic_check
  check (
    topic in (
      'lessons',
      'lesson_waitlist',
      'setup_service',
      'shop_support',
      'other'
    )
  );

notify pgrst, 'reload schema';
