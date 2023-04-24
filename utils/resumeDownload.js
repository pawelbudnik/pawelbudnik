export function download() {
  const URL = 'public\resume\Resume-Pawel-Budnik.pdf';
  if (typeof window !== "undefined"){
    window.location.href = URL
  }
}