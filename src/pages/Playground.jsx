import React , { useState, useEffect, useRef, useMemo }from 'react'
import { Canvas } from '@react-three/fiber'
import { Ground } from '../components/Playground/Ground'
import { Stats, Sky, useHelper, useGLTF, Html } from '@react-three/drei'
import { Character } from '../components/Playground/Character'
import { io } from 'socket.io-client'
import { Text, useAnimations } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
import { Physics, Debug } from '@micmania1/react-three-rapier'
import { useFrame } from '@react-three/fiber'
import { Affix, Modal, Container, Grid, Col, Text as MantineText } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { containsTHBadWords, filterTHBadWords } from '../components/handleTHBadwords'
import badWords from 'bad-words';
import TextareaAutosize  from 'react-textarea-autosize'
import EmojiPicker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import Peer from 'simple-peer'
import sendingMsg from '/assets/send-message.png'
import LoadingScene2 from './LoadingScene2'
import MessagesBox from '../components/Playground/MessagesBox'

import interfacestyles from './Interface.module.css'
import quizStyles from './QuizGane.module.css'
import loginstyles from './Login.module.css'

import { useSocketClient } from '../components/Login/SocketClient'
import { useCharacterCustomization } from '../components/Configurator/CharacterCustomization'
import { useVideoChat } from '../components/context'
import Login from './Login'
import Configurator from './Configurator'
import { pushNotification } from '../components/Playground/Notification'

const OtherPlayers = ({action, avatarUrl}) => {
  const cloneRef = useRef()

  const { scene } = useGLTF(avatarUrl)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

  const { animations: walkAnimation} = useGLTF("/models/animations/M_Walk_001.glb")
  const { animations: idleAnimation} = useGLTF("/models/animations/M_Standing_Idle_001.glb")

  const { actions } = useAnimations([walkAnimation[0], idleAnimation[0]], cloneRef)
  
  const currentAction = useRef("");

  clone.traverse((object) => {
    if(object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  })
  
  useEffect(() => {
    
    if(currentAction.current != action) {
      const nextActionToplay = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.32);
      nextActionToplay?.reset().fadeIn(0.32).play();
      currentAction.current = action;
    }
    
  },[action])

  useFrame((state, delta) => {
    const hips = cloneRef.current.getObjectByName("Hips");
    hips.position.set(0, hips.position.y, 0);
  })

  return (
      <group ref={cloneRef} >
        <primitive object={clone} scale={[0.5, 0.5, 0.5]} rotation={[0, 9.4, 0]}/>
      </group>
  )
}

function RotatingText(props) {
  const textRef = useRef()
  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
  })

  return (
      <Text 
        ref={textRef} 
        {...props} 
      />
  )
}

// function QuestionButton({position, setshowQuestion}) {
//   const buttonRef = useRef()
//   useFrame(({ camera }) => {
//     if (buttonRef.current) {
//       buttonRef.current.lookAt(camera.position);
//     }
//   })

//   const openQ = () => {
//     const result = window.confirm('ต้องการดำเนินการหรือไม่?');

//     if (result) {
//       setshowQuestion(true)
//     } else {
//       return;
//     }
//   };

//   return (
//     <mesh ref={buttonRef} position={position} >
//       <sphereGeometry args={[0.8, 15, 15]} />
//       <meshPhysicalMaterial color="black" transparent opacity={0.2} />
//       <Text 
//         onClick={openQ}
//         position={[0, 0, 1]} 
//         fontSize={0.3} 
//         color="white"  
//         anchorX="center" 
//         anchorY="middle"
//         // onClick={() => {}}
//       >
//         Question!
//       </Text>
//     </mesh>
    
//   );
// }

const UserWrapper = ({ position, rotation, name, action, chathead, avatarUrl}) => {
  
  const [showChatBubble, setShowChatBubble] = useState(false);

  useEffect(() => {
    if(chathead != ''){
      setShowChatBubble(true)
      
    } else {
      setShowChatBubble(false) 
    }

  },[chathead])

  return (
      <group
          position={position}
          rotation={rotation}
      >
         
        <OtherPlayers action={action} avatarUrl={avatarUrl} />
          <Html 
            occlude 
            position-y={1.6} 
            zIndexRange={[1, 0]} 
            distanceFactor={5} 
            style={{
              transition: 'all 0.5s',
              opacity: showChatBubble ? 1 : 0,
              transform: `scale(${showChatBubble ?  1 : 0.5})`,
            }}
          >
            <div className={interfacestyles.ChatBubble}>
                
              <p className={interfacestyles.chatBubbleText}>
                {chathead}
              </p>

            </div>
          </Html>

          <RotatingText 
            position={[0, 1.1, 0]}
            color="black"
            anchorX="center"
            anchorY="middle"
            fontSize={0.2}
            font="/fonts/kanit/kanit-light.otf"
            outlineWidth={0.025}
            outlineColor="white"
          > 
            {name} 
          </RotatingText>
              
      </group>
  )
}

const Lights = ({x, y, z}) => {
  
  const light = useRef()
  // useHelper(light, THREE.DirectionalLightHelper, 'cyan')

  return (
      <group position={[x, y, z]}>
          <pointLight  color="#bdefff" intensity={0.3}  />
          {/* <mesh>
            <boxBufferGeometry />
            <meshStandardMaterial wireframe/>
          </mesh> */}
      </group>
  )
}

// const Video = ({peer}) => {
//   const ref = useRef();

//   useEffect(() => {
//     peer.on("stream", stream => {
//       ref.current.srcObject = stream;
//     })
//   }, []);

//   return (
//     <video style={{display: "none"}} playsInline autoPlay ref={ref} />
//   );
// }

function Playground() {

  const {
    email,
    configChar, 
    logedIn,
    username,
    socketClient,
    setSocketClient,
    setErrorEmail,
    Web_URL,
    setAdminLogedIn,
    currentRoom,
    onLoading,
    setOnLoading
  } = useSocketClient();

  const {
    MicisToggled,
    Peers,
    setPeers,
    callUser,
  } = useVideoChat();

  const [clients, setClients] = useState({})

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false)

  const [isGetEmail, setIsGetEmail] = useState(false)

  const testing = false

  const messageListRef = useRef();

  // const [questions, setQuestions] = useState([{}])

  // const [Peers, setPeers] = useState([]);
  // const peersRef = useRef([]);

  // function createPeer(userToSignal, callerID, stream) {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream,
  //   });

  //   peer.on("signal", signal => {
  //     socketClient.emit("sending signal", { userToSignal, callerID, signal })
  //   })

  //   return peer;
  // }

  // function addPeer(incomingSignal, callerID, stream) {
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream,
  //   })

  //   peer.on("signal", signal => {
  //     socketClient.emit("returning signal", { signal, callerID })
  //   })

  //   peer.signal(incomingSignal);

  //   return peer;
  // }

  // useEffect(() => {
  //   if(MicisToggled) {
      
      
  //     const { id } = socketClient;
      
  //     navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
	// 	    socketClient.emit("join room", { id })

  //       socketClient.on("all users", (users) => {
  //         console.log('all users')
  //         const peers = [];
  //         users.forEach(userID => {
  //           const peer = createPeer(userID, id, stream);
  //           peersRef.current.push({
  //             peerID: userID,
  //             peer,
  //           })
  //           peers.push(peer);
  //         })
  //         setPeers(peers);
  //         ;
  //       })
  
  //       socketClient.on("user joined", ({signal, callerID}) => {
  //         console.log("user joined")
  //         const peer = addPeer(signal, callerID, stream);
  //         peersRef.current.push({
  //           peerID: callerID,
  //           peer: peer,
  //         })
  //         console.log(peer)         
  //         setPeers(users => [...users, peer]);
  
  //       })

  //     })

  //   } 
  // },[MicisToggled])

  useEffect(() => {
    if (logedIn) { 
      setSocketClient(io.connect(Web_URL))
      setIsGetEmail(true)
    }

  }, [logedIn])
  
  useEffect(() => {
    if (isGetEmail) {
      socketClient.emit("getEmail", {email})
    } 
  }, [isGetEmail])

  useEffect(() => {
    if (socketClient) {
      socketClient.on("move", (clients) => {
        setClients(clients);
      })

      socketClient.on("message", (message) => {
        setMessages(message);
      })
  
      // socketClient.on("selectedQuestions", (selectedQuestions) => {
      //   setQuestions(selectedQuestions);
      // });

      socketClient.on("alreadyLogin", (error) => {
        setErrorEmail(error)
      })

      socketClient.on("isPicked", ({type, header, text}) => {
        
        pushNotification(header, text, type)
      })
   
      socketClient.on("Admin_check", (check) => {
        if (check) {
          setAdminLogedIn(true)
        } else {
          setAdminLogedIn(false)
          const errorMsg = "ID หรือ Password ไม่ถูกต้อง"
          pushNotification("ล้มเหลว", errorMsg, "error")
        }
      });
      
      // socketClient.on("receiving returned signal", ({signal, id}) => {
        
      //   console.log("receiving returned signal")
      //   const item = peersRef.current.find(p => p.peerID === id);
      //   item.peer.signal(signal);
      // });

    }
    
  }, [socketClient])

  const sendMessage = () => {
    const { id } = socketClient;
    const filter = new badWords();
    
    setShowPicker(false)

    if(message !== ""){
      if(filter.isProfane(message)) {
        // handle bad message
        const msg = {
          id, 
          username: username, 
          message: filter.clean(message),
          color: HairColor,
        }
        socketClient.emit("message", msg);
        setMessage("");
      } else if(containsTHBadWords(message)) {
        // handle bad message
        const msg = {
          id, 
          username: username, 
          message: filterTHBadWords(message),
          color: HairColor,
        }
        socketClient.emit("message", msg);
        setMessage("");
      } else {
        // handle good message
        const msg = {
          id, 
          username: username, 
          message: message,
          color: HairColor,
        }
        socketClient.emit("message", msg);
        setMessage("");
      }
    }
  };

  // const [showQuestion, setshowQuestion] = useState(false);
  
  function scrollToBottom() {
    if(messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages, messageListRef.current]);

  // const [currentQuestion, setCurrentQuestion] = useState(0);
  // const [showScore, setShowScore] = useState(false);
  // const [score, setScore] = useState(0);
  // const [answered, setAnswered] = useState(null);
  // const [correctAnswer, setCorrectAnswer] = useState(null)
  // const [nextQuestionBT, setNextQuestionBT] = useState(false)

  // const handleAnswerClick = (isCorrect, index) => { 
  //   if(answered === null){
  //     setAnswered(index)
  //     setNextQuestionBT(true)
  //     if(isCorrect) {
  //       setScore(score + 1);
  //       setCorrectAnswer(true)
  //     } else {
  //       setCorrectAnswer(false)
  //     }
  //   }
  //   return ;
  // };

  const handleUserSelect = (username) => {
    setMessage((prevValue) => prevValue.replace(/@\S*$/, `@${username} `)); // Replace the last word after "@"
    setShowUserSuggestions(false);
  };
  
  if(logedIn && configChar){
      return (socketClient &&
          <div className={interfacestyles.container}>
    
            {/* <Affix position={{top: 20, left: 500,}} style={{zIndex: '2',}}> 
              <div style={{padding: "20px", display: "flex", height: "100vh", width: "90%", margin: "auto", flexWrap: "wrap"}}>
                {Peers.map((peer, index) => {
                  return (
                    <Video key={index} peer={peer} />
                  )
                })}
              </div>
    
            </Affix> */}
    
            <Affix position={{bottom: 20, right: 20, }} style={{zIndex: '2',}}>
              
                <div className={interfacestyles.InteractiveContainer}>
    
                  {/* <div className={interfacestyles.MicbuttonContainer}>
                    <button 
                      onClick={callUser}
                      style={{
                        backgroundColor: MicisToggled ? 'rgb(220, 20, 60, .6)' : 'rgba(0, 0, 0, .25)',
                      }}
                    >
                      mic
                    </button>
                  </div> */}
                  
                  <div className={interfacestyles.chatInputContainer} >
                    <div className={interfacestyles.textareaContainer}>
                      <TextareaAutosize 
                        value={message} 
                        onChange={(e) => {
                          setMessage(e.target.value) 
                          let text = e.target.value;
                          
                          if (text.charAt(text.length-1) === '@') {
                            setShowUserSuggestions(true)
                          } else {
                            setShowUserSuggestions(false);
                          }
                        }} 
                        onKeyDown={(e) => {
    
                          if (e.keyCode === 13 ) { // 13 is the code for the "Enter" key
                            e.preventDefault(); // Prevent the default action of the "Enter" key
                            e.target.value = ''
                            sendMessage()
                          }
                        }} 
                        aria-label='Chat' 
                        placeholder='Chat' 
                        maxRows={2}
                      />
                    </div>
    
                    <button onClick={() => setShowPicker(!showPicker)}>
                      😊
                    </button>
                    
                  </div>
    
                  <div className={interfacestyles.MicbuttonContainer}>
                    <button 
                      onClick={sendMessage}
                    >
                      <img src={sendingMsg} style={{pointerEvents: 'none', userSelect: 'none', width: '25px', height: '25px',}}/>
                    </button>
                  </div>
    
                </div>
            </Affix>
    
            <Affix position={{bottom: 80, right: 20, }} style={{zIndex: '2',}} >
    
                <ul className={interfacestyles.ul_chatBox} ref={messageListRef}>
                    {messages.map((message, index) => (
                      <MessagesBox message={message} index={index} />
                    ))}
                  
                </ul>
    
                {showUserSuggestions && (
                  <div className={interfacestyles.usersList}>
    
                    {Object.keys(clients)
                      .filter((clientKey) => clientKey !== socketClient.id)
                      .map((client) => {
                        const { name } = clients[client]
    
                        if(name !== ''){
                          return (
                            <p key={client} onClick={() => handleUserSelect(name)}>
                                    
                              {name}
                            </p>
                          )
                        }
                      })
                    }
                  </div>
                )}
              
                {showPicker && 
                  <div style={{ position: 'absolute', bottom: '50px', right: '10px' }}>
                    <EmojiPicker 
                      data={data} 
                      onEmojiSelect={(emoji) => { setMessage((prevMessage) => prevMessage + emoji.native) }}
                      emojiTooltip={true} 
                    />
                  </div>
                }
    
            </Affix>
    
            <Affix position={{top: 20, left: 20}} style={{zIndex: '2',}}>
                <div className={interfacestyles.Exit_button_container}>
                  <button onClick={() => {
                    window.location.reload()
                  }}>
                    Return
                  </button>
                </div>
            </Affix>
    
            {/* <Modal size="xl" opened={showQuestion} onClose={() => { setshowQuestion(false) }} title="Question" style={{zIndex: '2',}}>
              <div className={quizStyles.quizCard}>
                {showScore ? (
                  <div className={quizStyles.result}>
                    You scored {score} out of {questions.length}
                    <button 
                      onClick={() => {
                        
                        setScore(0)
                        setShowScore(false)
                        setCurrentQuestion(0)
                        setAnswered(null)
                        setNextQuestionBT(false)
                        setAnswered(null)
                        socketClient.emit('getRandomQuestions')
                      }}
                    >
                      play again
                    </button>
                  </div>
                ) : 
                (
                  <div className={quizStyles.quizCard}>
                    <div className={quizStyles.questionSection}>
                      <div className={quizStyles.questionText}>
                          {questions[currentQuestion].question}
                      </div>
                      <div className={quizStyles.questionCount}>
                        <span> {currentQuestion + 1} </span>
                        / {questions.length}
                      </div>
                    </div>
                    <div className={quizStyles.AnswerSection}>
                      {questions[currentQuestion].answerOptions.map((answer, index) => (
                        <button 
                          key={index}
                          className={quizStyles.answerBT} 
                          onClick={() => handleAnswerClick(answer.isCorrect, index)}
                          style={{
                            color: index === answered ? (correctAnswer ? '#2AAA8A' : '#ff3300') : "#000" && 
                            answered ? (answer.isCorrect ? '#2AAA8A' : '#000') : "#000"
                          }}
                        >
                          {answer.answerText} 
                        </button>
                      ))}
                      { nextQuestionBT && (
                      <button 
                        onClick={() => {
                          
                          const nextQuestion = currentQuestion + 1;
    
                          if(nextQuestion < questions.length) {
                            setCurrentQuestion(nextQuestion);
                            setAnswered(null)
                            setNextQuestionBT(false)
                            setAnswered(null)
                          } else {
                            setShowScore(true)
                          }
                        }}
                        className={quizStyles.nextQuestionBT}
                      >
                        nextQuestion
                      </button>)}
                    </div>
                  </div>
                )}
              </div>
            </Modal> */}
    
            <Canvas 
              shadows  
              camera={{
                fov: 70,
              }}
            >
              {testing ? <Stats/> : null}
              {testing ? <axesHelper args={[2]}/> : null}
              {testing ? <gridHelper args={[10, 10]}/> : null}
              {/* <Lights x={-15} y={10} z={-17}/> */}
              {/* <Lights x={8} y={10} z={7}/> */}
              {/* <Lights x={-15} y={10} z={7}/> */}
              <Lights x={10} y={10} z={10}/>
              {/* <Lights x={8} y={10} z={11}/>
              <Lights x={8} y={10} z={22}/> */}
              <Lights x={-10} y={10} z={-10}/>
              <Lights x={0} y={10} z={0}/>
              
              <ambientLight intensity={0.4} position={[0, 10, 0]} />
              {/* <Sky sunPosition={new THREE.Vector3(100, 10, 100)} /> */}
              {/* <OrbitControls /> */}
              <Physics timeStep="vary" >
                {/* <Debug /> */}
                <Ground x={100} z={100} currentRoom={currentRoom} setOnLoading={() => setOnLoading(true)}/>
                <Character socket={socketClient} pos={[0, 2, 0]} />
                
              </Physics>
                {Object.keys(clients)
                  .filter((clientKey) => clientKey !== socketClient.id)
                  .map((client) => {
                    const { position, rotation, name, action, chathead, avatarUrl, } = clients[client]
                      return (
                        <UserWrapper
                          key={client}
                          name={name}
                          position={position}
                          rotation={rotation}
                          action={action}
                          chathead={chathead}
                          // equipment={equipment}
                          avatarUrl={avatarUrl}
                        />
                      )
                  })
                }
                {/* <GetitemButton socketClient={socketClient} item={AddonEquipments[0]} position={[2, 3, 2]} isTextVisible={item1_Visible} setTextVisibility={setItem1_Visible} />
                <GetitemButton socketClient={socketClient} item={AddonEquipments[1]} position={[1, 3, 1]} isTextVisible={item2_Visible} setTextVisibility={setItem2_Visible} /> */}
                {/* <QuestionButton position={[4, 3, 4]} setshowQuestion={setshowQuestion} /> */}
            </Canvas>
            
            <LoadingScene2 onLoading={onLoading} setOnLoading={() => setOnLoading(false)}/>  
          </div>
      )
     
  }

  if ( logedIn ) {
    return ( <Configurator />)
  }

  else {
    return ( <Login /> )
  }
}

useGLTF.preload("/public/models/animations/M_Walk_001.glb");
useGLTF.preload("/public/models/animations/M_Standing_Idle_001.glb");
useGLTF.preload("/public/models/animations/M_Dances_001.glb");
useGLTF.preload("/public/models/animations/M_Standing_Expressions_001.glb");

export default Playground
