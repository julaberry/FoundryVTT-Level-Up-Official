export default function replaceHyphenWithMinusSign(number: Number) {
  const stringForm = number.toString();
  return stringForm.replaceAll('-', '\u2212');
}
