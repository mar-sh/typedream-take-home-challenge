import React, { useState, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

import Toolbar from "./Toolbar";

const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "Build the ",
        bold: true,
      },
      {
        text: "page",
        rainbow: true,
      },
      {
        text: " you need in minutes!",
        bold: true,
      },
    ],
  },
];

const getMarkFromKeys = (event) => {
  const metaOrCtrl = event.ctrlKey || event.metaKey;
  const { key } = event;

  if (metaOrCtrl && key) {
    event.preventDefault();

    switch (key) {
      case "b":
        return "bold";
      case "u":
        return "underline";
      case "i":
        return "italic";
      default:
        return;
    }
  }
};

const MyEditor = (props) => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <div className="editor-wrapper">
      <Slate editor={editor} value={initialValue}>
        <Toolbar />
        <Editable
          id="editor"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            const mark = getMarkFromKeys(event);
            if (mark) {
              toggleMark(editor, mark);
            }
          }}
        ></Editable>
      </Slate>
    </div>
  );
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;

    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <strike>{children}</strike>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.rainbow) {
    children = <span className="rainbow">{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
};

export default MyEditor;
