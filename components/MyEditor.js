import React, { useState, useCallback } from "react";
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
} from "slate";
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

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <div
      style={{
        border: "2px solid #ddd",
        padding: "0 20px 10px 20px",
        width: "60vw",
      }}
    >
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

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return Boolean(match);
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : format,
  });
};

const Button = ({ format, type, ...props }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);

  return (
    <button
      className={`toolbar-btn ${isActive ? "active" : ""}`}
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
      <Button format="strikethrough">
        <strike>A</strike>
      </Button>
      <Button format="code">{"<>"}</Button>
      <Button format="rainbow">🌈</Button>
    </div>
  );
};

export default MyEditor;
