import React from 'react'
import styles from './InputControl.module.css'

function InputControl(props) {
  return (
    <div className={styles.container}>
        {props.label && <label>{props.label}</label>}
        <input type="text" maxLength={20} {...props} />
    </div>
  )
}

export default InputControl