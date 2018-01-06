export default function(string, search) {
  let i = 0, n = -1, l
  
  const hay = string.toLowerCase()
  const needle = search.toLowerCase();
  
  for( ; l = needle[ i++ ]; ) if( !~(n = hay.indexOf(l, n + 1)) ) return false
  return true
}