import React, { useState, useCallback } from "react";
import { Editor, Transforms, createEditor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";

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
        bold: true,
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
  const [val, setVal] = useState(JSON.stringify(initialValue, null, 2));

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <div style={{ border: "2px solid #ddd", padding: "0 20px", width: "60vw" }}>
      <Slate
        editor={editor}
        value={initialValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            const content = JSON.stringify(value, null, 2);
            setVal(content);
          }
        }}
      >
        <Toolbar />
        <Editable
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            const mark = getMarkFromKeys(event);
            if (mark) {
              toggleMark(editor, mark);
            }
          }}
        ></Editable>
      </Slate>

      <pre>
        <code>{val}</code>
      </pre>
    </div>
  );
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

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const Button = ({ format, ...props }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);
  const style = {
    color: isActive ? "black" : "gray",
    outline: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  };

  return (
    <button
      style={style}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {props.children}
    </button>
  );
};

const Toolbar = () => {
  const editor = useSlate();

  return (
    <div
      style={{
        borderBottom: "2px solid #ddd",
        padding: "10px",
        margin: "0 -20px 10px -20px ",
      }}
    >
      <Button format="bold">𝗕</Button>
      <Button format="italic">𝐼</Button>
      <Button format="underline">𝐔</Button>
      <Button format="code">{"<>"}</Button>
      <Button format="strikethrough">
        <strike>A</strike>
      </Button>
      <Button format="rainbow">🌈</Button>
    </div>
  );
};

export default MyEditor;
