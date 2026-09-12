-- Keep existing own-user RLS semantics while avoiding per-row auth.uid() re-evaluation.
alter policy profiles_select_own on public.profiles using ((select auth.uid()) = id);
alter policy profiles_insert_own on public.profiles with check ((select auth.uid()) = id);
alter policy profiles_update_own on public.profiles using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

alter policy attempts_select_own on public.assessment_attempts using ((select auth.uid()) = user_id);
alter policy attempts_insert_own on public.assessment_attempts with check ((select auth.uid()) = user_id);
alter policy attempts_update_own on public.assessment_attempts using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

alter policy assessment_reports_select_own on public.assessment_reports using ((select auth.uid()) = user_id);
alter policy assessment_reports_insert_own on public.assessment_reports with check ((select auth.uid()) = user_id);
alter policy assessment_reports_update_own on public.assessment_reports using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
