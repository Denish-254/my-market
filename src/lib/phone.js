export function toWhatsApp(phone) {
  let p = String(phone).replace(/\D/g, "");
  if (p.startsWith("0")) p = "254" + p.slice(1);
  else if (p.length === 9) p = "254" + p;
  return p;
}