export function checkIfNextDay(){
  const now = new Date();
  const hour = now.getHours();
  console.log(hour >= 16 ? 'Так це наступний день' : 'Ні це минулий')
  if(hour >= 16) return true
  else return false
}