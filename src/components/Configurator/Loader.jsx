import React from "react";
import Loaderstyles from './Loader.module.css'

const Loader = () => {

    return (
        <div className={Loaderstyles.loader_background}>
            
            <span className={Loaderstyles.loader} />
        </div>
    )
}

export default Loader