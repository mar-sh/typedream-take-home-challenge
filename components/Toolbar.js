import { Editor, Transforms, Element as SlateElement } from "slate";
import { useSlate } from "slate-react";

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

const BlockButton = ({ format, ...props }) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format);

  return (
    <button
      className={`toolbar-btn ${isActive ? "active" : ""}`}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {props.children}
    </button>
  );
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
    <div className="toolbar-wrapper">
      <Button format="bold">𝗕</Button>
      <Button format="italic">𝐼</Button>
      <Button format="underline">𝐔</Button>
      <Button format="strikethrough">
        <strike>A</strike>
      </Button>
      <Button format="code">{"<>"}</Button>
      <BlockButton format="block-quote">＂</BlockButton>
      <Button format="rainbow">🌈</Button>
    </div>
  );
};

export default Toolbar;
