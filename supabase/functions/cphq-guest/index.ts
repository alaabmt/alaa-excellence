import { createHandler } from '../_shared/cphq.ts';
Deno.serve(createHandler('guest'));
