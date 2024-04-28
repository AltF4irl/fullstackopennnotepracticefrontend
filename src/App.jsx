import {useState, useEffect} from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'
import loginService from './services/login'

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
    addNoteHandler: (e) => {
      e.preventDefault()
      const noteObject = {
        content: newNote,
        important: Math.random() < 0.5
      }

      noteService
        .create(noteObject)
        .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
          setNewNote('')
        })
    },
    noteChangeHandler: (e) =>  {
      setNewNote(e.target.value)
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
    }
  }
  const {addNoteHandler, noteChangeHandler, showImportantClickHandler, importantNoteClickHandler, loginHandler} = eventHandler

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const loginForm = () => (
    <form onSubmit={loginHandler}>
      <h2>Login</h2>
      <div>
        Username
        <input 
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input 
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type='submit'>Login</button>
      </div>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNoteHandler}>
        <input 
        value={newNote} 
        onChange={noteChangeHandler}
        />
        <button type="submit">Save</button>
    </form>
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
        <button onClick={showImportantClickHandler}>
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