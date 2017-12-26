import safeParseFloat from './safeParseFloat'
import get from 'lodash/get'

export default (obj, path, defaultValue) => safeParseFloat(get(obj, path, defaultValue))