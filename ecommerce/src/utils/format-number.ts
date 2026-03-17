import numeral from 'numeral'

// ----------------------------------------------------------------------

export type InputNumberValue = string | number | null | undefined

function processInput(inputValue: InputNumberValue): number | null {
  if (inputValue == null || Number.isNaN(inputValue)) return null
  return Number(inputValue)
}

type InputValue = string | number | null

export const formatInputNumber = (val: any) => {
  if (!val) return ''
  const number = parseFloat(val.replace(/,/g, ''))
  if (isNaN(number)) return ''
  return new Intl.NumberFormat('en-US').format(number)
}

export function fNumber(number: InputValue) {
  return numeral(number).format()
}

export function fCurrency(number: InputValue) {
  const format = number ? numeral(number).format('0,0.00') : ''

  return result(format, '.00')
}

export function fCurrencyVND(number: InputValue) {
  const format = number ? numeral(number).format('0,0') : '0'
  return `${format} ₫`
}

export function fPercent(number: InputValue) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : ''

  return result(format, '.0')
}

export function fShortenNumber(number: InputValue) {
  const format = number ? numeral(number).format('0.00a') : ''

  return result(format, '.00')
}

// export function fData(number: InputValue) {
//   const format = number ? numeral(number).format('0.0 b') : '';

//   return result(format, '.0');
// }

function result(format: string, key = '.00') {
  const isInteger = format.includes(key)

  return isInteger ? format.replace(key, '') : format
}

export function fData(inputValue: InputNumberValue) {
  const number = processInput(inputValue)
  if (number === null || number === 0) return '0 bytes'

  const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']
  const decimal = 2
  const baseValue = 1024

  const index = Math.floor(Math.log(number) / Math.log(baseValue))
  const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`

  return fm
}
