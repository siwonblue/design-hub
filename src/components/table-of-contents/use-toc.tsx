import { useEffect, useState } from "react";

export default function useToc() {
  const [indexList, setIndexList] = useState<
    { index: string; tagName: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState<string>("");

  useEffect(() => {
    const result = document
      .querySelector("main")
      ?.querySelectorAll("h1,h2") as NodeListOf<Element>;
    const IOList: IntersectionObserver[] = [];
    let IO: IntersectionObserver;
    const copyOfNodeList = result;
    console.log("??", copyOfNodeList);
    copyOfNodeList?.forEach((node) => {
      const index = node.textContent as string;
      const tagName = node.tagName as string;
      setIndexList((prev) => {
        if (prev.map((v) => v.index).includes(index)) return prev;
        return [...prev, { index, tagName }];
      });
      node.id = index;
      // 목차 강조
      IO = new IntersectionObserver(
        ([
          {
            isIntersecting,
            target: { textContent },
          },
        ]) => {
          if (!isIntersecting) return;
          setCurrentIndex(textContent!);
        },
        { threshold: 1 }
      );
      IO.observe(node);

      // 이벤트 해제를 위해 등록
      IOList.push(IO);
    });
  }, []);

  return { indexList, currentIndex };
}
