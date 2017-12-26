import endsWith from 'lodash/endsWith'

export default (str, search = [], searchTo = str.length) => {
  const searchArr = Array.isArray(search) ? search : [ search ]
  return searchArr.some(s => endsWith(str, s, searchTo))
}