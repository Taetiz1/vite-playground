import React from "react";

const thaiBadWords = [
  'ควย', 'ไอสัส', 'สัส', 'หน้าหี',
  "ส้นตีน", "ตีน", "ควย", "เหี้ย", 
  "มึง", "เย็ด", "ไอ้ควาย", "ห่า",
  "ไอห่า", 'kuy', 'nahee', 'hee', 
  'isus', 'aisus', "หี",
]
    
export function filterTHBadWords(text) {
  const regex = new RegExp(thaiBadWords.join("|"), "gi");
  
  return text.replace(regex, '***');
}

export function containsTHBadWords(text) {

  for (let i = 0; i < thaiBadWords.length; i++) {
    if (text.includes(thaiBadWords[i])) {
      return true;
    }
  }

  return false;
}