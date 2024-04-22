import React, { useState, useEffect } from "react"
import { useSocketClient } from "../Login/SocketClient";
import quizStyles from './QuizGane.module.css'
import { Container, SimpleGrid, Text, Button, Table, Box, ScrollArea } from "@mantine/core";

const QuestionPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null)
    const [nextQuestionBT, setNextQuestionBT] = useState(false)
    const [start, setStart] = useState(false)
    const [timer, setTimer] = useState(10); 

    const {
        questions,
        socketClient,
        email,
        username,
        leaderBoard, 
    } = useSocketClient()

    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        if(start && !answered) {
            const id = setInterval(() => {
                setTimer(prevTimer => {
                    if(prevTimer > 0) {
                        return prevTimer - 1;
                    } else {
                        return 0;
                    }
                });
            }, 1000);

            setIntervalId(id);

            return () => clearInterval(id);
        }
    }, [currentQuestion, start, answered]);

    useEffect(() => {   
        if(showScore) {
            if(email !== '' && email !== null) {
                socketClient.emit('set score', {email: email, username: username, score: score})
            }
        }
    }, [showScore])

    const handleAnswerClick = (isCorrect, index) => {
        if(answered === null) {
            clearInterval(intervalId); 
            setAnswered(index);
            setNextQuestionBT(true);
            if(isCorrect) {
                const i = 10;
                setScore(score + (i * timer));
                setCorrectAnswer(true);
            } else {
                setCorrectAnswer(false);
            }
        }
    };

    function handleNext() {
        const nextQuestion = currentQuestion + 1;

        if(nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setAnswered(null)
            setNextQuestionBT(false)
            setAnswered(null)
        } else {
            setShowScore(true)
        }
        setTimer(10)
    }

    function handlePlayAgain() {
        setScore(0)
        setShowScore(false)
        setCurrentQuestion(0)
        setAnswered(null)
        setNextQuestionBT(false)
        setAnswered(null)
        setTimer(10)
        socketClient.emit('getRandomQuestions')
    }

    if(!start){
        return(
            <Container>
                <SimpleGrid cols={1}>
                    <Container>
                        <Text fw={700} fz="xl" >leaderboard</Text>
                        <Table striped highlightOnHover withBorder captionSide="top">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Username</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderBoard.length > 0 && leaderBoard.slice(0, 10).map((pace, index) => {
                            
                                    return (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{pace.username}</td>
                                            <td>{pace.score}</td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </Table>
                    </Container>
                    <Button 
                        onClick={() => {setStart((true))}}
                        uppercase
                    >
                        start 
                    </Button>
                </SimpleGrid>

            </Container>
        )
    } else {
        return(
            <Container>
                {showScore ? (
                    <Container>
                        <SimpleGrid cols={1}>
                            <Container>
                                <Text fw={700} fz="xl" >You scored: {score} </Text>
                            </Container>
                            
                            <Button 
                                onClick={handlePlayAgain}
                            >
                                play again
                            </Button>
                            <Button 
                                onClick={() => {
                                    setStart(false)
                                    setScore(0)
                                    setShowScore(false)
                                    setCurrentQuestion(0)
                                    setAnswered(null)
                                    setNextQuestionBT(false)
                                    setAnswered(null)
                                    setTimer(10)
                                    socketClient.emit('getRandomQuestions')
                                }}
                            >
                                leaderBoard
                            </Button>
                        </SimpleGrid>
                    </Container>
                ) : (
                    <Container>
                        <SimpleGrid cols={1}>
                            <Container>
                                <SimpleGrid cols={2}>
                                    <Text fw={700} fz="xl">{currentQuestion + 1} / {questions.length}</Text>
                                    <Text fw={700} fz="xl" color={timer== 0 ? "red" : ""}>time: {timer}</Text>
                                </SimpleGrid>
                            </Container>
                            <Text fw={700} fz="xl">{currentQuestion+1}. {questions[currentQuestion].question}</Text>
                            
                        </SimpleGrid>
                        <div className={quizStyles.AnswerSection}>
                            {questions[currentQuestion].answerOptions.map((answer, index) => (
                                <button 
                                    key={index}
                                    className={quizStyles.answerBT} 
                                    onClick={() => handleAnswerClick(answer.isCorrect, index)}
                                    style={{
                                        color: index === answered ? (correctAnswer ? '#2AAA8A' : '#ff3300') : "#000" && 
                                        answered ? (answer.isCorrect ? '#2AAA8A' : '#fff') : "#fff"
                                    }}
                                >
                                    {answer.answerText} 
                                </button>
                            ))}
                            { nextQuestionBT && (
                                <Button 
                                    onClick={handleNext}
                                    className={quizStyles.nextQuestionBT}
                                    uppercase
                                    color="green"
                                >
                                    next
                                </Button>
                            )}
                        </div>
                    </Container>
                )}
            </Container>
        )
    }
}

export default QuestionPage