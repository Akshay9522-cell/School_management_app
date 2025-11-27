import {api} from '../api/api'

export const getClassRoom=()=>{

  return  api.get('/classroom/get')
}