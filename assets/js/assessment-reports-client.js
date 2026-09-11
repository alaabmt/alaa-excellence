import { createAuthClient } from './assessment-auth-client.js';

function endpoint() {
  return window.TAMAYUZ_AUTH_CONFIG?.reportsEndpoint || '';
}

async function authContext() {
  const client = await createAuthClient();
  const { data, error } = await client.auth.getSession();
  if (error || !data.session?.access_token) throw new Error('AUTH_REQUIRED');
  return { client, token: data.session.access_token };
}

export async function listAssessmentReports() {
  const url = endpoint();
  if (!url) throw new Error('REPORTS_NOT_CONFIGURED');
  const { token } = await authContext();
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`REPORT_LIST_FAILED_${response.status}`);
  return response.json();
}

export async function fetchAssessmentReport(reportId) {
  const url = endpoint();
  if (!url) throw new Error('REPORTS_NOT_CONFIGURED');
  const { token } = await authContext();
  const response = await fetch(`${url}?report_id=${encodeURIComponent(reportId)}`, {
    headers: { authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`REPORT_FETCH_FAILED_${response.status}`);
  return response.blob();
}

export async function openAssessmentReport(reportId, fileName = 'assessment-report.pdf') {
  const blob = await fetchAssessmentReport(reportId);
  const objectUrl = URL.createObjectURL(blob);
  const win = window.open(objectUrl, '_blank', 'noopener,noreferrer');
  if (!win) {
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
}

export async function uploadAssessmentReport(attemptId, pdfBlob, fileName = 'assessment-report.pdf') {
  const url = endpoint();
  if (!url) throw new Error('REPORTS_NOT_CONFIGURED');
  if (!(pdfBlob instanceof Blob) || pdfBlob.type !== 'application/pdf') throw new Error('PDF_REQUIRED');
  const { token } = await authContext();
  const qs = new URLSearchParams({ attempt_id: attemptId, file_name: fileName });
  const response = await fetch(`${url}?${qs.toString()}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/pdf'
    },
    body: pdfBlob
  });
  if (!response.ok) throw new Error(`REPORT_UPLOAD_FAILED_${response.status}`);
  return response.json();
}
