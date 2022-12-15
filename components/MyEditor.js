import React, { useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const MyEditor = (props) => {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <div style={{ border: "2px solid #ddd", padding: "20px", width: "60vw" }}>
      <Slate editor={editor} value={initialValue}>
        <Editable></Editable>
      </Slate>
    </div>
  );
};

export default MyEditor;
