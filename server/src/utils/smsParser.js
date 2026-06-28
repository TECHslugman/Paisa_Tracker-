function parseBNBSms(raw) {
  // account last 4 — "XXXXX4471"
  const acctMatch = raw.match(/[Xx*]+(\d{4})/);

  // type — "Debited" or "Credited"
  const isCredit = /credited/i.test(raw);

  // amount — "BTN 25.00"
  const amountMatch = raw.match(/BTN\s+([\d,]+\.?\d*)\s+with ref/i);

  // reference_id — "ref:261553557"
  const refMatch = raw.match(/ref[:\s]+(\d+)/i);

  // timestamp — "04-06-2026 at 01:36 PM"
  const dateTimeMatch = raw.match(/on\s+(\d{2}-\d{2}-\d{4})\s+at\s+(\d{1,2}:\d{2}\s+[AP]M)/i);

  // balance after — "BTN 2,404.11" at end
  const balMatch = raw.match(/balance is BTN\s+([\d,]+\.?\d*)/i);

  // parse timestamp into ISO
  let timestamp = new Date().toISOString();
  if (dateTimeMatch) {
    const [day, month, year] = dateTimeMatch[1].split('-');
    const timeStr = dateTimeMatch[2]; // "01:36 PM"
    timestamp = new Date(`${year}-${month}-${day} ${timeStr}`).toISOString();
  }

  return {
    raw_sms: raw,
    type: isCredit ? 'credit' : 'debit',
    amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null,
    currency: 'BTN',
    reference_id: refMatch ? refMatch[1] : `SMS_${Date.now()}`,
    timestamp,
    account_last4: acctMatch ? acctMatch[1] : null,
    balance_after: balMatch ? parseFloat(balMatch[1].replace(/,/g, '')) : null,
    merchant: null, // BNB SMS doesn't include merchant
    source: 'mpay_sms',
  };
}

module.exports = { parseBNBSms };
