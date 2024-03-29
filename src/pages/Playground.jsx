import React , { useState, useEffect, useRef, Suspense }from 'react'
import { Canvas } from '@react-three/fiber'
import { Ground } from '../components/Playground/Ground'
import { Stats, Sky, useHelper } from '@react-three/drei'
import Character from '../components/Playground/Character'
import { io } from 'socket.io-client'
import { Physics } from '@micmania1/react-three-rapier'
import { Affix } from '@mantine/core'
import { containsTHBadWords, filterTHBadWords } from '../components/handleTHBadwords'
import badWords from 'bad-words';
import TextareaAutosize  from 'react-textarea-autosize'
import EmojiPicker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import sendingMsg from '/assets/send-message.png'
import LoadingScene2 from './LoadingScene2'
import ConnectionFailed from './ConnectionFailed'
import MessagesBox from '../components/Playground/MessagesBox'
import VideoCall from '../components/Voice/VideoCall'
import Minimap from '../components/Playground/miniMap'
import UserWrapper from '../components/Playground/UserWrapper'

import { IconHeadset } from '@tabler/icons-react'
import { IconMicrophoneOff } from '@tabler/icons-react'
import micMute from '/assets/micMute.png'
import mute from '/assets/mute.png'
import { AgoraVideoPlayer } from 'agora-rtc-react'

import interfacestyles from './Interface.module.css'
import quizStyles from './QuizGane.module.css'
import { useSocketClient } from '../components/Login/SocketClient'
import { useVideoChat } from '../components/voiceContext'
import Login from './Login'
import Configurator from './Configurator'
import { pushNotification } from '../components/Playground/Notification'

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

function Playground() {

  const {
    email,
    configChar, 
    logedIn,
    setLogedIn,
    username,
    socketClient,
    setSocketClient,
    setErrorEmail,
    Web_URL,
    currentRoom,
    onLoading,
    setOnLoading,
    onConnectionFailed,
    setOnConnectionFailed,
    clients,
    setClients,
    connectServer
  } = useSocketClient();

  const {
    connectPeer,
    setConnectPeer,
    VideoUsers
  } = useVideoChat();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false)
  const [onRespawn, setOnRespawn] = useState(false) 

  const [isGetEmail, setIsGetEmail] = useState(false)

  const testing = false

  const messageListRef = useRef();

  // const [questions, setQuestions] = useState([{}])

  useEffect(() => {
    if(connectServer) { 
      setSocketClient(io.connect(Web_URL))
      setIsGetEmail(true)
    }

  }, [connectServer])
  
  useEffect(() => {
    if(isGetEmail) {
      socketClient.emit("getEmail", {email})
    } 
  }, [isGetEmail])

  useEffect(() => {
    if(socketClient) {
      socketClient.on("move", (clients) => {
        setClients(clients);
      })

      socketClient.on("message", (message) => {
        setMessages(message);
      })
  
      // socketClient.on("selectedQuestions", (selectedQuestions) => {
      //   setQuestions(selectedQuestions);
      // });

      socketClient.on("alreadyLogin", (check) => {
        if(check) {
          setErrorEmail(true)
          setLogedIn(true)
        } 

        setLogedIn(true)
      })

      socketClient.on("enabled Join Voice", ({enabled}) => {
        if(enabled) {
          setConnectPeer(true)
        }
      })

      socketClient.on("failed move", () => {
        setOnConnectionFailed(true)
      })

      socketClient.on('connect_error', (error) => {
        if(error.message === 'xhr poll error') {
          const errorMsg = "The server may not be running or is unreachable, please try again later."
          pushNotification("ล้มเหลว", errorMsg, "error")
        }
      })

    }
    
  }, [socketClient])

  const sendMessage = () => {
    const { id } = socketClient;
    const filter = new badWords();
    
    setShowPicker(false)

    if(message !== ""){
      
      let cleanMsg

      if(filter.isProfane(message)) {

        cleanMsg = filter.clean(message)
        
      } else if(containsTHBadWords(message)) {
        
        cleanMsg = filterTHBadWords(message)

      } else {
        cleanMsg = message
      }
      
      const msg = {
        id, 
        username: username, 
        message: cleanMsg,
        time: Date.now()
      }
      socketClient.emit("message", msg);
      setMessage("");
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
  
  if(logedIn && configChar && currentRoom){
      return (socketClient &&
          <div className={interfacestyles.container}>
    
            <Affix position={{bottom: 20, right: 20, }} style={{zIndex: '2',}}>
              
              <div className={interfacestyles.InteractiveContainerWrap}>

                <div style={{
                  display: 'flex',
                  padding: connectPeer ? "0px" : "4px",
                  margin: '4px',
                  marginRight: '0px',
                  backgroundColor: "rgba(0, 0, 0, .25)",
                  borderRadius: connectPeer ? "20px" : "28px",
                  alignContent: 'center',
                  alignItems: 'end',
                  height: connectPeer ? "228.2px" : "48px",
                }}>

                  {!connectPeer && <div>
                    <button 
                      className={interfacestyles.Micbutton}
                      onClick={() => {
                        if(email !== '' && email !== null) {
                          socketClient.emit("join voice", {id: socketClient.id})
                        } else {
                          const errorMsg = "โปรดใช้บัญชี Gmail ในการเข้าสู่ระบบ"
                          pushNotification("ล้มเหลว", errorMsg, "error")
                        }
                      }}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, .25)',
                        alignItems: 'center',
                        justifyItems: 'center'
                      }}
                    >
                      <IconHeadset 
                        strokeWidth={1.5} 
                      />
                    </button>
                  </div>}

                  {connectPeer && <div 
                    style={{
                      display: 'grid',
                      gap: '0px',
                      height: 'auto', 
                      width: '240px',
                    }}
                  >
                    <VideoCall />  
                  </div>}
                </div>

                <div className={interfacestyles.InteractiveContainer}>
                  
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
    
                          if(e.keyCode === 13 ) { 
                            e.preventDefault();
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
    
                  <div className={interfacestyles.SendMsgbuttonContainer}>
                    <button 
                      onClick={sendMessage}
                    >
                      <img src={sendingMsg} style={{pointerEvents: 'none', userSelect: 'none', width: '25px', height: '25px',}} />
                    </button>
                  </div>
    
                </div>
              </div>
            </Affix>
    
            <Affix position={{bottom: 80, right: 20, }} style={{zIndex: '2',}} >
    
                <ul className={interfacestyles.ul_chatBox} ref={messageListRef}>
                  {messages.map((message, index) => (
                    <MessagesBox key={index} message={message} msgIndex={index} />
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

            <Affix position={{top: 100, left: 0 }} style={{zIndex: '2',}} >

              <div 
                className={interfacestyles.otherVideoContainer}
              >
                {VideoUsers.length > 0 &&
                  VideoUsers.map((user) => {
                      return (
                        <div
                          key={user.uid} 
                          className={interfacestyles.otherVideoWrap}
                        >
                          {(clients[user.uid] !== null && clients[user.uid] !== undefined) && 
                            <a>
                              {clients[user.uid].name}
                            </a>
                          }

                          {!user.audioTrack && <div className={interfacestyles.micOffAlert}>
                            <img src={micMute} style={{pointerEvents: 'none', userSelect: 'none', width: '16px'}} />
                          </div>}

                          {/* {mutedUser.find((User) => User === user.uid)  && <div className={interfacestyles.muteAlert}>
                            <img src={mute} style={{pointerEvents: 'none', userSelect: 'none', width: '16px'}} />
                          </div>} */}
                          
                          {user.videoTrack &&
                            <AgoraVideoPlayer 
                              videoTrack={user.videoTrack}
                              audioLevel={user.audioLevel}
                              style={{ 
                                width: "135px",
                                height: "101px",
                              }} 
                            />
                          }
                        </div>
                      )
                  })
                }
              </div>

            </Affix>
    
            <Affix position={{top: 20, left: 20}} style={{zIndex: '2',}}>
              <div className={interfacestyles.button_container}>
                <button onClick={() => {
                  window.location.reload()
                }}>
                  Exit
                </button>

                <button onClick={() => {
                  setOnRespawn(true)
                }}>
                  Respawn
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
    
            <Suspense fallback={null}> 
              <Canvas 
                shadows  
                camera={{
                  fov: 70,
                }}
              >
                
                <Minimap />
                {testing ? <Stats/> : null}
                {testing ? <axesHelper args={[2]}/> : null}
                {testing ? <gridHelper args={[10, 10]}/> : null}
                <Lights x={40} y={25} z={20} />
                <Lights x={-60} y={25} z={-10} />
                
                <ambientLight intensity={0.4} position={[0, 25, 0]} />
                <Sky />
                <Physics timeStep="vary">
                  {currentRoom && <>
                    <Ground key={currentRoom.id} currentRoom={currentRoom} setOnLoading={() => setOnLoading(true)} />
                    <Character socket={socketClient} onRespawn={onRespawn} setOnRespawn={() => setOnRespawn(false)} />
                  </>}
                </Physics>
                  {Object.keys(clients)
                    .filter((clientKey) => clientKey !== socketClient.id)
                    .map((client) => {
                      const { position, rotation, name, action, chathead, avatarUrl} = clients[client]
                        return (
                          <UserWrapper
                            key={client}
                            id={client}
                            name={name}
                            position={position}
                            rotation={rotation}
                            action={action}
                            chathead={chathead}
                            avatarUrl={avatarUrl}
                          />
                        )
                    })
                  }
                  {/* <QuestionButton position={[4, 3, 4]} setshowQuestion={setshowQuestion} /> */}
              </Canvas>
            </Suspense>
            <LoadingScene2 onLoading={onLoading} setOnLoading={() => setOnLoading(false)} />
            {onConnectionFailed && <ConnectionFailed />}
          </div>
      )
     
  }

  if( logedIn ) {
    return ( <Configurator />)
  }

  else {
    return ( <Login /> )
  }
}

export default Playground