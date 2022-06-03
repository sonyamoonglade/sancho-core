import {Injectable} from "@nestjs/common";


@Injectable()
export class ValidationService {


  constructor() {

  }


  validateObjectFromSqlInjection(underValidate: object): boolean{

    let triggerWords =
      ["DROP", "DATABASE", "CASCADE", "CASCADE ALL", "WHERE",
      "*", "PG", "FROM", "TABLE", "USERS","ORDERS","SESSIONS"]

    triggerWords = triggerWords
      .concat(triggerWords.map(word => word.toLowerCase()))
    for(const [key,value] of Object.entries(underValidate)){

      for(const word of key.split(' ') || key){
        if(triggerWords.includes(word)) return false
      }
      for(const word of typeof value == 'string' ? value.split(' ') : ""){
        if(triggerWords.includes(word)) return false
      }
    }
    return true
  }

  validatePhoneNumber(phone_number: string): boolean{

    if(phone_number.length !== 12) return false
    else if(phone_number[0] !== '+') return false
    else if(phone_number[1] !== ("7" || "8")) return false
    else if(phone_number[2] !== "9") return false

    return true
  }




}