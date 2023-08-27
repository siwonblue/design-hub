import dynamic from "next/dynamic";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import tw from "twin.macro";
import { Toc } from "~/components/table-of-contents";
import { quillContents } from "~/constants";

// for SSR in next.js
const ReactQuill = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <></>,
});

const modules = {
  toolbar: [[{ header: "1" }, { header: "2" }]],
};

export const Quill = () => {
  const [value, setValue] = useState(quillContents);

  const quillRef = useRef<MutableRefObject<undefined>>(null);

  return (
    <Wrapper>
      <DescriptionWrapper>
        <div>
          H1 과 H2 를 이용해서 글을 작성하면 TOC 를 확인할 수 있습니다 :)
        </div>
      </DescriptionWrapper>
      <BodyWrapper>
        <EditorWrapper>
          <ReactQuill
            //@ts-ignore
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
          />
        </EditorWrapper>
        <PreviewWrapper>
          <h1>Preview</h1>
          <main>
            <div dangerouslySetInnerHTML={{ __html: value }} />
          </main>
        </PreviewWrapper>
      </BodyWrapper>
      <Toc />
    </Wrapper>
  );
};

const Wrapper = tw.div`
  w-[800px] h-[3000px] bg-blue-50 p-[15px]
  flex flex-col gap-[30px] rounded-md shadow-sm
`;

const DescriptionWrapper = tw.div`
`;

const BodyWrapper = tw.div`
  flex gap-2
`;

const EditorWrapper = tw.div`
  w-[400px] 
`;

const PreviewWrapper = tw.div`
  w-[400px] 
  break-all
`;
