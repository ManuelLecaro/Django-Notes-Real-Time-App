import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

import "../index.css";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1)
    }
  }
}));

export default function SinglePaperComponent({ sendValue, deleteValue, type_style, defaultData = {} }) {
  const classes = useStyles();

  const [text, setText] = useState();

  const [styleColor, setStyleColor] = useState("");

  const handleNote = e => {
    defaultData["text"] = e.target.value;
    setText(text);
    sendValue(defaultData);
  };

  useEffect(() => {
    let color = type_style % 2 === 0? "note-green": "note-pink";
    setStyleColor(color);
  }, [type_style])

  useEffect(() => {
    if (defaultData === {}) {
      defaultData["text"] = "";
    } else {
      setText(defaultData.text);
    }
  }, [defaultData]);

  const handleDelete = () => {
    deleteValue(defaultData);
  };

  return (
    <>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        style={{ marginRight: "2em" }}
      >
        <div className={styleColor}>
          <Button>
            <DeleteIcon
              style={{ color: "red" }}
              onClick={handleDelete}
            ></DeleteIcon>
          </Button>
          <TextField
            id="filled-read-only-input"
            multiline
            rows="4"
            InputProps={{
              readOnly: false
            }}
            defaultValue={text}
            onBlur={handleNote}
          ></TextField>
        </div>
      </form>
    </>
  );
}
