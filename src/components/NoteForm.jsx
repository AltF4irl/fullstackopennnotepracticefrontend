import { useState } from 'react'

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('')

    const addNoteHandler = (e) => {
        e.preventDefault()
        const noteObject = {
          content: newNote,
          important: true
        }

        createNote(noteObject)
        setNewNote('')
    }

    return (
        <form onSubmit={addNoteHandler}>
            <input 
            value={newNote} 
            onChange={({ target }) => setNewNote(target.value)}
            />
            <button type="submit">Save</button>
        </form>
    )
}

export default NoteForm