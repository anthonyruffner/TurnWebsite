// ============================================================
// TURN Form Submissions — Google Apps Script
// Paste this entire file into your Google Apps Script editor.
// It logs every form submission to a Google Sheet and
// sends an instant email notification to you.
// ============================================================

const NOTIFY_EMAIL = 'anthony@turnapts.com';
const SHEET_NAME_DEMOS = 'Demo Requests';
const SHEET_NAME_CONTACTS = 'Contact Messages';

function doPost(e) {
  try {
    const data = e.parameter;  // reads URL-encoded form fields
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.form === 'demo_request') {
      logDemoRequest(ss, data);
      sendNotification('New Demo Request', data);
    } else if (data.form === 'contact_message') {
      logContactMessage(ss, data);
      sendNotification('New Contact Message', data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function logDemoRequest(ss, data) {
  let sheet = ss.getSheetByName(SHEET_NAME_DEMOS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_DEMOS);
    sheet.appendRow(['Timestamp', 'Full Name', 'Email', 'Phone', 'Company', 'Message']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
  sheet.appendRow([
    data.submitted_at || new Date().toISOString(),
    data.full_name || '',
    data.email || '',
    data.phone || '',
    data.company || '',
    data.message || ''
  ]);
}

function logContactMessage(ss, data) {
  let sheet = ss.getSheetByName(SHEET_NAME_CONTACTS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_CONTACTS);
    sheet.appendRow(['Timestamp', 'Full Name', 'Email', 'Company', 'Message']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  sheet.appendRow([
    data.submitted_at || new Date().toISOString(),
    data.full_name || '',
    data.email || '',
    data.company || '',
    data.message || ''
  ]);
}

function sendNotification(subject, data) {
  const lines = [];
  if (data.full_name) lines.push('Name: ' + data.full_name);
  if (data.email)     lines.push('Email: ' + data.email);
  if (data.phone)     lines.push('Phone: ' + data.phone);
  if (data.company)   lines.push('Company: ' + data.company);
  if (data.message)   lines.push('Message: ' + data.message);
  lines.push('');
  lines.push('Submitted: ' + (data.submitted_at || new Date().toISOString()));

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'TURN Website — ' + subject,
    body: lines.join('\n')
  });
}
