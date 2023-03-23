export function getDiffPos(str1: string, str2: string) {
  let i = 0

  if (str1 === str2) {
    return 0
  }

  while (str1[i] === str2[i]) i++
  return i
}
