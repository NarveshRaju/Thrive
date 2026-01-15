import React from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.css";

// ---------- FONT FAMILIES ----------
const Font = Quill.import("formats/font");
// values become class names like .ql-font-inter, .ql-font-open-sans etc.
Font.whitelist = [
  "inter",
  "space-grotesk",
  "poppins",
  "times-new-roman",
  "open-sans",
  "canva-sans",
  "serif",
  "mono",
];
Quill.register(Font, true);

// ---------- FONT SIZES ----------
const Size = Quill.import("formats/size");
// values become classes like .ql-size-14px
Size.whitelist = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px",
  "30px",
];
Quill.register(Size, true);

// ---------- TOOLBAR ----------
const toolbarOptions = [
  [{ font: Font.whitelist }],
  [
    {
      size: [
        "10px",
        "12px",
        "14px",
        "16px",
        "18px",
        "20px",
        "22px",
        "24px",
        "26px",
        "28px",
        "30px",
      ],
    },
  ],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  [{ header: [1, 2, 3, false] }],
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
