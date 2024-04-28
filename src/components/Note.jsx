const Note = ({note, onClick}) => {
    const label =  note.important
    ? 'Make Not Important' : 'Make Important'
    return (
        <li className="note">
            {note.content}
            <button onClick={onClick}>{label}</button>
        </li>
    )
}

export default Note