export function checkIfNextDay(){
  const now = new Date();
  const hour = now.getHours();
  console.log(hour >= 15 ? 'Так це наступний день' : 'Ні це минулий')
  console.log(hour)
  if(hour >= 15) return true
  else return false
}