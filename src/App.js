import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyDncLV_q935wzTu4xhQ6EbzySFjwq10_n4",
  authDomain: "message-demo-1013a.firebaseapp.com",
  projectId: "message-demo-1013a",
  storageBucket: "message-demo-1013a.appspot.com",
  messagingSenderId: "312454976537",
  appId: "1:312454976537:web:d00c1e94bb9606c4774688",
  measurementId: "G-MQNS2Y3GXF"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

 
function App() {

  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header></header>
      <section>
        {user ? <ChatRoom/> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn(){
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider()

    auth.signInWithPopup(provider)
  }
  return(
      <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom (){
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')

  const dummy = useRef()

  const sendMessage = async(e) => {
    e.preventDefault()

    const {uid, photoURL} = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('')
    dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} />
        <button type='submit'>🐄</button>
      </form>
      <SignOut />
    </>
  )
}

function ChatMessage(props){

  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received"
  

  return ( 
  <div className={`message ${messageClass}`}>
    <img src={photoURL}/>
    <p>{text}</p>
  </div>
  )
}
export default App;
