# CPHQ secure practice API

Supabase project: tamayuz10x-auth (`dqrsjhcfmpjhcxvtxosy`).

Deployed function: `https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1/cphq-practice`

Authenticated POST request with `Authorization: Bearer <learner-access-token>` and Supabase publishable/anon key header:

- `{ "action": "next", "domain": 1 }` returns a published question without the answer key.
- `{ "action": "submit", "question_id": 1, "selected_index": 2 }` records a learner attempt and returns explanations.

Database functions `cphq_daily_count`, `cphq_next_registered`, and `cphq_submit_registered` enforce the registered learner quota of 20 attempts per UTC day. Premium status is read from `cphq_entitlements`; payment webhook integration is not implemented. All 13 sample questions remain in `review` and cannot be retrieved by this API.

**Security note:** Do not embed service-role keys in frontend code. The deployed endpoint requires an authenticated learner JWT. Guest practice and guest quotas are not yet implemented server-side. Questions must undergo editorial approval before changing their status to `published`.

**Remaining:** connect site login to this endpoint, implement guest identity/quotas, payment checkout and verified webhooks, editorial approval, domain-task verification, rate limiting, tests, and full exam simulation.
