import React from "react";
import mobilestyles from './Mobile.module.css'

function Mobile() {

    return(
    
        <div className={mobilestyles.container}>
      
            <div className={mobilestyles.innerBox}>
                    
                <div className={mobilestyles.logo}>
                    <h3>Metaverse</h3>
                    <p>Wat•suan•kaew</p>
                </div>
                        
                <p>*กรุณาเข้าสู่ระบบผ่านคอมพิวเตอร์*</p>

            </div>
        </div>
    )
}

export default Mobile