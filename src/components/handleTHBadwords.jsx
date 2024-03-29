import React from "react";

const thaiBadWords = [
  'ควย', 'ไอสัส', 'สัส', 'หน้าหี',
  "ส้นตีน", "ตีน", "เหี้ย", "หี",
  "มึง", "เย็ด", "ไอ้ควาย", "ห่า",
  "ไอห่า", 'kuy', 'nahee', 'hee', 
  'isus', 'aisus', 'isas', 'aisas'
]
    
export function filterTHBadWords(text) {
  const regex = new RegExp(thaiBadWords.join("|"), "gi");
  
  return text.replace(regex, (match) => "*".repeat(match.length));
}

export function containsTHBadWords(text) {

  for (let i = 0; i < thaiBadWords.length; i++) {
    if (text.includes(thaiBadWords[i])) {
      return true;
    }
  }

  return false;
}