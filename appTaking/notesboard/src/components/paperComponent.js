import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import SinglePaperComponent from "./singlePaperComponent";

import useWebSocket, { ReadyState } from "react-use-websocket";

import "../index.css";

const URL = "ws://localhost:9000/note";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

export default function Board() {
  const [wholeNotes, setWholeNotes] = useState([]);
  const [newNote, setNewNote] = useState();
  const [socketUrl, setSocketUrl] = useState(URL);
  const [messageHistory, setMessageHistory] = useState([]);
  const [sendMessage, lastMessage, readyState, getWebSocket] = useWebSocket(
    socketUrl
  );

  const classes = useStyles();

  useEffect(() => {
    if (lastMessage !== null) {
      let data = JSON.parse(lastMessage.data);
      let validator =
        data.data === undefined ? data.created : data.data.created;
      if (validator === undefined && data.data !== "message_deleted") {
        updateRender(lastMessage);
      } else {
        getNotes();
      }
      setMessageHistory(prev => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed"
  }[readyState];

  useEffect(() => {
    if (connectionStatus === "Open") {
      getNotes();
    }
  }, []);

  const getNotes = () => {
    let message = { type: "get.note", content: {} };
    if (connectionStatus === "Open") {
      sendMessage(JSON.stringify(message));
    }
  };

  const submitMessage = () => {
    if (newNote != null) {
      let message_content = { text: newNote, created: "" };
      let message = { type: "create.note", content: message_content };
      sendMessage(JSON.stringify(message));
      setNewNote("");
      getNotes();
    }
  };

  const updateNotes = messageString => {
    let message = { type: "update.note", content: messageString };
    sendMessage(JSON.stringify(message));
  };

  const deleteNotes = messageString => {
    let message = { type: "delete.note", content: messageString };
    sendMessage(JSON.stringify(message));
  };

  const updateRender = lastMessage => {
    let raw_notes = JSON.parse(lastMessage.data).match(/\{.*?\"}(?!")/g);
    let clean_notes = [];
    raw_notes.map(function(x) {
      clean_notes.push(JSON.parse(x));
    });
    setWholeNotes(clean_notes);
  };

  const handleNote = e => {
    setNewNote(e.target.value);
  };

  return (
    <div style={{ margin: "2em" }}>
      <Grid container className={classes.root} spacing={2}>
        {wholeNotes.map(function(d, idx) {
          return (
            <Grid item xs={2}>
              <SinglePaperComponent
                sendValue={updateNotes}
                deleteValue={deleteNotes}
                type_style = {idx}
                defaultData={d}
              ></SinglePaperComponent>
            </Grid>
          );
        })}
      </Grid>
      <Grid container className={classes.root} spacing={2}>
        <TextField
          label="New note"
          multiline
          rows="4"
          className="note-blue"
          defaultValue={newNote}
          onChange={handleNote}
        ></TextField>
        <Fab
          color="secondary"
          aria-label="add"
          className={classes.margin}
          onClick={submitMessage}
        >
          <AddIcon />
        </Fab>
      </Grid>
    </div>
  );
}
