import React, { useState, useRef, useMemo, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import BlotFormatter from "quill-blot-formatter/dist/BlotFormatter";
import ImageResize from 'quill-image-resize-module-react';
import katex from "katex";
import "katex/dist/katex.min.css";
import { storage } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

window.katex = katex;

Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register('modules/imageResize', ImageResize);

const QuillEditor = (props) => {
  const quillRef = useRef();

  const modules = useMemo(() => {
    return {
      blotFormatter: {},
      clipboard: {
        matchVisual: false
      },
      toolbar: {
        container: [
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["link", "image", "video", "formula"],
          ["clean"],
        ],
      },
      imageUploader: {
        upload: async (file) => {
          return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              'state_changed',
              (snapshot) => {
                // Handle progress if needed
              },
              (error) => {
                console.error('Error uploading image:', error);
                reject(error);
              },
              async () => {
                try {
                  const url = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve(url);
                } catch (error) {
                  console.error('Error getting download URL:', error);
                  reject(error);
                }
              }
            );
          });
        },
      },
    };
  }, []);

  const formats = [
    "header",
    "align",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "script",
    "indent",
    "direction",
    "size",
    "link",
    "image",
    "video",
    "width",
    "height",
    "data-align"
  ];

  const handleChange = (value) => {
    const setParentContent = props.contentChange;
    setParentContent(value);
  };

  return (
    <div className="font-noto-sans prose-3xl bg-white">
      <ReactQuill
        theme="snow"
        value={props.defaultValue}
        onChange={handleChange}
        ref={quillRef}
        placeholder={"type here.."}
        formats={formats}
        modules={modules}
        readOnly={props.preview}
        bound={".app"}
      />
    </div>
  );
};

export default QuillEditor;
