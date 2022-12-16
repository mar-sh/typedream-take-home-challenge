import React, { useState, useCallback } from "react";
import { Editor, Transforms, createEditor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  return <span {...attributes}>{children}</span>;
};

const Toolbar = () => {
  const editor = useSlate();

  const toggleBold = (event) => {
    event.preventDefault();
    const marks = Editor.marks(editor);

    const isActive = marks ? marks.bold === true : false;

    if (isActive) {
      Editor.removeMark(editor, "bold");
    } else {
      Editor.addMark(editor, "bold", true);
    }
  };

  return (
    <div
      style={{
        borderBottom: "2px solid #ddd",
        padding: "10px",
        margin: "0 -20px 10px -20px ",
      }}
    >
      <button onMouseDown={toggleBold}>Bold</button>
    </div>
  );
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
            console.log(content);
            setVal(content);
          }
        }}
      >
        <Toolbar />
        <Editable
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (event.key === "`" && event.ctrlKey) {
              event.preventDefault();
              // Determine whether any of the currently selected blocks are code blocks.
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "code",
              });
              // Toggle the block type depending on whether there's already a match.
              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "code" },
                { match: (n) => Editor.isBlock(editor, n) }
              );
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

export default MyEditor;
