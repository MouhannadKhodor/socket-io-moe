import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const Page = styled.div`
  display: flex;
  height:100vh;
  width: 100%;
  align-items: center;
  background-color: white;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  max-height: 300px;
  overflow: auto;
  width: 400px;
  border: 1px solid lightgray;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 25px;
`;

const TextArea = styled.textarea`
  width: 98%;
  height: 100px;
  border-radius: 10px;
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 17px;
  background-color: light;
  border: 1px solid lightgray;
  outline: none;
  color: dark;
  letter-spacing: 1px;
  line-height: 20px;
  ::placeholder {
    color: lightgray;
  }
`;

const Button = styled.button`
  background-color: black;
  width: 31.33%;
  margin:3px;
  border: none;
  height: 50px;
  border-radius: 10px;
  color: red;
  font-size: 17px;
  cursor:pointer;
  
`;

const Form = styled.form`
  width: 400px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: black;
  color: red;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: transparent;
  color: black;
  border: 1px solid red;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
`;

const App = () => {

  const [yourID, setYourID] = useState();
  const [message, setMessage] = useState("");
  const [peeps, setPeeps] = useState([])
  const [toMap, setToMap] = useState([])
  const [connected, setConnected] = useState()
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('https://codi-server.herokuapp.com');
    socketRef.current.on("youare", awnser => {
      setYourID(awnser.id);
    })
    socketRef.current.on("peeps", awnser => {
      setPeeps(awnser.length)
    })
    socketRef.current.on('next', (message_from_server) => console.log(message_from_server))
    socketRef.current.emit('whoami')

    socketRef.current.on('connect', () => {
      setConnected(true);
    })

    socketRef.current.on('disconnect', () => {
      setConnected(false);
    })


  }, []);

  // function receivedMessage(message) {
  //   setMessages(oldMsgs => [...oldMsgs, message]);
  // }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      text: message,
      id: yourID,
      name: "mouhannad",
    };
    setMessage("");
    socketRef.current.emit("message", messageObject);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  //  function concat(){ 
  //    var sum = 0;
  //    var b = res.split("+")
  //    console.log(b)
  //    for (var i=0;i<b.length;i++){
  //      sum = sum + parseInt(b[i])
  //    }
  // return sum 
  //  }


  return (

    <Page>
      <div style={{marginTop:'10px'}}>
        <div style={{ display: 'flex' }}>
          <span>Connection Stauts:&nbsp;&nbsp; </span>
          {connected ? (<div><i style={{ color: "green" }} className="fas fa-circle"></i></div>) : (<div><i style={{ color: "red" }} className="fas fa-circle"></i></div>)}
        </div>

        <div style={{ color: 'dark' }}><p><i style={{ color: "black" ,fontSize:'20px' }} className="fas fa-users"></i> &nbsp;&nbsp;{peeps}</p></div>
        <div style={{ color: 'dark' }}><p><i style={{ color: "black" ,fontSize:'20px' }} className="fas fa-id-card"></i>&nbsp;&nbsp;{yourID}</p> </div>
        
      </div>
      <Container>

        {toMap.map((message, index) => {
          if (message.id === yourID) {
            return (
              <MyRow key={index}>
                <MyMessage>
                  {message.text}
                </MyMessage>
              </MyRow>
            )
          }
          return (
            <PartnerRow key={index}>
              <PartnerMessage>

                {message.name + " : " + message.text}
              </PartnerMessage>
            </PartnerRow>
          )
        })}
      </Container>
      <Form onSubmit={sendMessage}>
        <TextArea value={message} onChange={handleChange} placeholder="Say something..." />
        <Button style={{ width: '100%' }} >Send</Button>
        {/* <Button onClick={() => console.log(socketRef.current.emit("ping!"))}>Ping!</Button>
        <Button onClick={() => console.log(socketRef.current.emit('whoami'))}>Who Am I!</Button> */}
        {/* <Button onClick={()=>console.log(socketRef.current.emit('give me next'))}>Give me next</Button>
        <Button onClick={()=>console.log(socketRef.current.emit('addition'))}>Addition</Button>
        <Button onClick={()=>console.log(socketRef.current.emit("answer",concat) )}>answer</Button> */}
        <Button style={{ width: '100%' }} onClick={() => socketRef.current.on("room", (message) => {
          setToMap(message); console.log(message)
        })}>All messages</Button>
        {/* <input 
        style={{width:'100%',
        height:'30px',
        borderRadius:"10px",
        backgroundColor:"light"
      
      }}
         placeholder="write the answer here" type="text" onChange={(e)=>setRes(e.target.value)}></input> */}
      </Form>
    </Page>
  );
};

export default App;
