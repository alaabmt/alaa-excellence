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
require('assets/js/protected-assessment-loader.js', 'currentSession', 'startAssessmentAttempt', 'requireWorkConsent')
require('assets/js/assessment-attempts-client.js', 'completeAssessmentAttempt', 'startAssessmentAttempt')
require('assets/js/assessment-reports-client.js', 'listAssessmentReports', 'uploadAssessmentReport', 'application/pdf')
require('assets/js/assessment-report-pdf.js', 'createAssessmentReportPdf', 'application/pdf')
require('assets/js/assessment-result-sync.js', 'completeAssessmentAttempt', 'createAssessmentReportPdf', 'uploadAssessmentReport')
account = require('account/index.html', 'listAssessmentReports', 'openAssessmentReport')
require('account/login.html', 'signInWithPassword', 'safeNext')
register = require('account/register.html', 'signUp', 'emailRedirectTo')

for path in ['assets/js/auth-config.js','assets/js/assessment-auth-client.js','assets/js/assessment-attempts-client.js','assets/js/assessment-reports-client.js','assets/js/assessment-result-sync.js','account/index.html','account/login.html','account/register.html']:
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