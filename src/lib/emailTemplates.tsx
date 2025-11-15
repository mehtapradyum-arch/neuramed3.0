
export const verifyEmailTemplate = (link: string) =>
  `<div style="font-family:sans-serif"><h2>Verify your email</h2><p>Confirm your address to use NeuraMed:</p><p><a href="${link}">Verify</a></p></div>`;

export const escalationPatientTemplate = (medName: string) =>
  `<div><p>Reminder: Please take your scheduled dose of <strong>${medName}</strong>.</p></div>`;

export const escalationCaregiverTemplate = (patient: string, medName: string) =>
  `<div><p>${patient} may have missed a dose: <strong>${medName}</strong>.</p></div>`;

export const lowStockTemplate = (medName: string, remaining: number) =>
  `<div><p>Low stock alert for <strong>${medName}</strong>. Remaining approx: ${remaining} doses.</p></div>`;
