/*
  # Sample Data Migration

  1. Sample Data
    - Insert sample voice assistants for demonstration
    - No schema changes in this migration
  
  This migration only adds sample data and does not modify the schema.
*/

-- Insert sample voice assistants if they don't exist
INSERT INTO voice_assistants (id, name, gender, accent, image_url, audio_sample_url, description, is_active)
VALUES
  (
    gen_random_uuid(),
    'AI Receptionist',
    'Female',
    'American',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    'https://example.com/audio/receptionist.mp3',
    '{"title": "Your 24/7 Virtual Receptionist", "content": ["Imagine never missing a customer call, even at 2 AM. Our AI assistant takes care of everything from simple questions to complex bookings.", "It can transfer calls to staff when needed, answer questions about your services and pricing, update customer records, and schedule appointments in real time."]}',
    true
  ),
  (
    gen_random_uuid(),
    'AI Support Agent',
    'Male',
    'British',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    'https://example.com/audio/support.mp3',
    '{"title": "Instant Customer Support Anytime", "content": ["No more long wait times or unanswered calls. Our AI support agent helps customers right away, solving their issues in seconds.", "It handles FAQs, troubleshoots common problems, checks account details, and escalates calls when needed so your team can focus on bigger tasks."]}',
    true
  ),
  (
    gen_random_uuid(),
    'AI Booking Assistant',
    'Female',
    'Australian',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    'https://example.com/audio/booking.mp3',
    '{"title": "Effortless Scheduling Without the Wait", "content": ["Say goodbye to missed bookings and scheduling delays. Our AI assistant manages reservations, confirmations, and cancellations instantly.", "It checks availability, secures appointments, sends reminders, and updates your system so your customers get what they need without the hassle."]}',
    true
  )
ON CONFLICT DO NOTHING;