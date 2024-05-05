import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Toggelable from './components/Toggelable'
import NoteForm from './components/NoteForm'

const App = () => {

  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then(allNotes => {
        setNotes(allNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('logedInUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const eventHandler = {
    createNote: (noteObject) => {
      noteService
        .create(noteObject)
        .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
        })
        noteFormRef.current.toggleVisibility()
    },
    showImportantClickHandler: () => {
      setShowAll(!showAll)
    },
    importantNoteClickHandler: (id) => {
      const current = notes.find(note => note.id === id)
      const updatedCurrent =  {...current, important: !current.important}

      noteService
        .update(id, updatedCurrent )
        .then(returnedNote => {
          setNotes(notes.map(note => note.id === id ? returnedNote : note))
        })
        .catch(err => {
          console.log(err)
          setErrorMessage(
            `Note '${updatedCurrent.content}' was already removed from the server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setNotes(notes.filter(note => note.id !== id))
        })
    },
    loginHandler: async (e) => {
      e.preventDefault()

      const logUser = {
        username: username,
        password: password
      }

      try {
        const user = await loginService.login(logUser)

        window.localStorage.setItem('logedInUser', JSON.stringify(user))

        noteService.setToken(user.token)

        setUser(user),
        setUsername('')
        setPassword('')
      } catch (err) {
        console.log(err)
        setUsername('')
        setPassword('')
        setErrorMessage('Wrong username or password')
        setTimeout(() => {
          setErrorMessage([])
        }, 5000)
      }
    },
    usernameChangeHandler: ({target}) => {
      setUsername(target.value)
    },
    passwordChnageHandler: ({target}) => {
      setPassword(target.value)
    }
  }
  const {
    showImportantClickHandler, 
    importantNoteClickHandler, 
    loginHandler,
    usernameChangeHandler,
    passwordChnageHandler,
    createNote
  } = eventHandler

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const loginForm = () => {
    return (
      <Toggelable buttonLabel='Login'>
        <LoginForm 
          username = {username}
          password = {password}
          usernameChangeHandler = {usernameChangeHandler}
          passwordChnageHandler = {passwordChnageHandler}
          loginHandler = {loginHandler}
        />
      </Toggelable>
    )
  }

  const noteForm = () => (
    <Toggelable buttonLabel='Create a New Note' ref={noteFormRef}>
      <NoteForm 
        createNote = {createNote}
      />
    </Toggelable>
  )

  return (
    <>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {
        user === null
          ? loginForm()
          : <div>
            <p>{user.name} logged in</p>
            {noteForm()}
          </div>
      }

      <div>
        <button onClick = {showImportantClickHandler}>
          Show {showAll ? 'Important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
          key={note.id} 
          note={note} 
          onClick={() => importantNoteClickHandler(note.id)}
          />  
        )}
      </ul>
      
      <Footer />
    </>
  )
}

export default App