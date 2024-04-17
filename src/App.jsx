import React, { useState, useEffect } from 'react'
import './App.css'

import Playground from './pages/Playground';
import Mobile from './pages/Mobile';
import { Notifications } from '@mantine/notifications';

function App() {

  const [ isMobile, setIsmobile] = useState(false)

  window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || 
      ( typeof window.performance !== "undefined" && window.performance.navigation.type === 2 );
    if(historyTraversal) {
      window.location.reload();
    }
  });

  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    if(isMobileDevice) {
      setIsmobile(isMobileDevice)
    }

  }, [isMobileDevice])

  return (
    <div className="App">
      {!isMobile ? <Playground /> : <Mobile /> }
      
      <Notifications position="top-right"/>
    </div>
  )
}

export default App
