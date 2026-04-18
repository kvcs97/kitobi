-- ============================================================
-- Migration 008: Seed data (run after signing up with a test account)
-- Replace 'YOUR-USER-ID' with your actual auth.users UUID
-- Find it under: Authentication → Users in Supabase Dashboard
-- ============================================================

do $$
declare
  v_user_id  uuid := '87342f73-0f5e-49a3-a28f-c979f4788375';
  v_subj1_id uuid;
  v_subj2_id uuid;
  v_deck1_id uuid;
  v_deck2_id uuid;
begin

  -- Subject 1
  insert into public.subjects (user_id, name, color)
  values (v_user_id, 'Algorithmen', '#C084FC')
  returning id into v_subj1_id;

  -- Subject 2
  insert into public.subjects (user_id, name, color)
  values (v_user_id, 'Lineare Algebra', '#67E8F9')
  returning id into v_subj2_id;

  -- Deck per subject
  insert into public.flashcard_decks (user_id, subject_id, name)
  values (v_user_id, v_subj1_id, 'Grundlegende Algorithmen')
  returning id into v_deck1_id;

  insert into public.flashcard_decks (user_id, subject_id, name)
  values (v_user_id, v_subj2_id, 'Vektoren & Matrizen')
  returning id into v_deck2_id;

  -- 5 test flashcards
  insert into public.flashcards (deck_id, front, back)
  values
    (v_deck1_id, 'Was ist die Zeitkomplexität von Bubble Sort?', 'O(n²) im Durchschnitt und Worst-Case'),
    (v_deck1_id, 'Was ist ein binärer Suchbaum?', 'Ein Baum, bei dem jeder Knoten links kleinere und rechts größere Werte hat'),
    (v_deck1_id, 'Was bedeutet O(log n)?', 'Die Laufzeit wächst logarithmisch mit der Eingabegröße'),
    (v_deck2_id, 'Was ist das Skalarprodukt?', 'a·b = Σ aᵢbᵢ — ergibt einen Skalar, nicht einen Vektor'),
    (v_deck2_id, 'Wann ist eine Matrix invertierbar?', 'Genau dann, wenn ihre Determinante ≠ 0 ist');

end $$;
