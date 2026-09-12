#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

def require(path, *needles):
    p = ROOT / path
    if not p.exists():
        errors.append(f"missing: {path}")
        return ''
    text = p.read_text(encoding='utf-8')
    for needle in needles:
        if needle not in text:
            errors.append(f"{path}: missing expected token: {needle}")
    return text

cfg = require('assets/js/auth-config.js', 'assessment-content', 'assessment-attempts', 'assessment-reports')
require('assets/js/main.js', 'applyAccountNavigation', 'account-switch', 'signed-in', 'signed-out')
require('assets/js/assessment-auth-client.js', 'safeNext', 'persistSession', 'autoRefreshToken')
require('assets/js/protected-assessment-loader.js', 'currentSession', 'startAssessmentAttempt', 'listAssessmentAttempts', 'requireWorkConsent', 'REPORT_UPGRADE_ATTEMPT_MISSING', 'reportUpgrade', 'tamayuz10x-lpp-owner-v1', 'tamayuz10x-lpp-state-v2:', 'tamayuz10x-work-owner-v1', 'lppStateCouldBelongToAttempt', 'MONTHLY_ATTEMPT_LIMIT_REACHED', 'monthlyLimit')
require('assets/js/assessment-attempts-client.js', 'completeAssessmentAttempt', 'startAssessmentAttempt', 'listAssessmentAttempts', 'monthly_attempt_limit_reached', 'MONTHLY_ATTEMPT_LIMIT_REACHED')
require('assets/js/assessment-reports-client.js', 'listAssessmentReports', 'uploadAssessmentReport', 'application/pdf')
require('assets/js/assessment-report-pdf.js', 'createAssessmentReportPdf', 'application/pdf')
require('assets/js/saved-lpp-report.js', 'createSavedLearningPreferenceReportPdf', 'pagesToPdf', 'application/pdf', "['A','R','T','P']")
require('assets/js/account-report-recovery.js', 'recoverSavedLearningPreferenceReport', 'uploadAssessmentReport', '-visual-v3-', 'result_json')
require('assets/js/account-report-auto.js', 'recoverSavedLearningPreferenceReport', 'assessment_attempts', 'listAssessmentReports')
require('assets/js/assessment-result-sync.js', 'completeAssessmentAttempt', 'createAssessmentReportPdf', 'uploadAssessmentReport', 'resultBelongsToAttempt', 'tamayuz:assessment-report-ready')
require('supabase/functions/assessment-attempts/index.ts', 'stale_result', 'duplicate_result', 'result_json->>completedAt', 'MONTHLY_ATTEMPT_LIMIT = 2', 'monthly_attempt_limit_reached', 'reset_at')
require('supabase/migrations/20260912153519_limit_assessment_attempts_per_month.sql', 'attempt_count >= 2', 'pg_advisory_xact_lock', 'monthly_attempt_limit_reached', 'before insert on public.assessment_attempts')
account = require('account/index.html', 'listAssessmentReports', 'openAssessmentReport', 'recoverableLppState', 'tamayuz10x-colour-report-recovery', 'reportUpgrade=1', 'account-report-auto.js', 'tamayuz10x-lpp-owner-v1', 'Continue assessment', 'متابعة التقييم', 'Start Learning Style Profile', 'ابدأ تقييم بصمتك في التعلّم')
require('account/login.html', 'signInWithPassword', 'safeNext')
register = require('account/register.html', 'signUp', 'emailRedirectTo')

for path in ['assets/js/auth-config.js','assets/js/assessment-auth-client.js','assets/js/assessment-attempts-client.js','assets/js/assessment-reports-client.js','assets/js/assessment-result-sync.js','assets/js/saved-lpp-report.js','assets/js/account-report-recovery.js','assets/js/account-report-auto.js','assets/js/protected-assessment-loader.js','account/index.html','account/login.html','account/register.html']:
    text = (ROOT/path).read_text(encoding='utf-8') if (ROOT/path).exists() else ''
    lowered = text.lower()
    if 'service_role' in lowered or 'service-role' in lowered:
        errors.append(f"{path}: service-role material must not be shipped to browser")

if 'username' in account.lower():
    errors.append('account/index.html: username should not be shown in the user-facing account page')

if 'name="username"' in register.lower() or 'id="username"' in register.lower():
    errors.append('account/register.html: visible username field conflicts with email + password login decision')

if errors:
    print('ASSESSMENT AUTH QA: FAIL')
    for e in errors:
        print('-', e)
    sys.exit(1)

print('ASSESSMENT AUTH QA: PASS')
