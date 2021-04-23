export function convertDurationToTimeString (duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  //coloca um 0 antes de cada unidade caso não aja dois digitos
  //exemplo: se for 1 hora será 01
  const timeString = [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0'));

  return `${timeString[0]}:${timeString[1]}:${timeString[2]}`;

}