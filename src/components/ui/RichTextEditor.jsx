// src/components/ui/RichTextEditor.jsx
import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.css";

const toolbarOptions = [
  [{ font: [] }],
  [{ size: ["small", false, "large"] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  ["link"],
  ["clean"],
];

const RichTextEditor = ({ value, onChange, placeholder }) => {
  return (
    <div className="rich-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={{ toolbar: toolbarOptions }}
      />
    </div>
  );
};

export default RichTextEditor;
