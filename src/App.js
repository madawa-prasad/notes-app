import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { nanoid } from 'nanoid';

import Sidebar from './components/sidebar/Sidebar';
import Editor from './components/editor/Editor';
import { data } from './data';
import './styles.css';

function App() {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem('notes')) || []
  );
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ''
  );

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  //This rearranges array, recently modified note shows on the top
  function updateNote(text) {
    setNotes((oldNotes) => {
      const newNotesArray = [];
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          newNotesArray.unshift({ ...oldNote, body: text });
        } else {
          newNotesArray.push(oldNote);
        }
      }
      return newNotesArray;
    });
  }

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
