import tw from "twin.macro";

import useToc from "./use-toc";
import { css, styled } from "styled-components";
import { usePathname } from "next/navigation";

export const Toc = () => {
  const { indexList, currentIndex } = useToc();
  const pathname = usePathname();
  console.log(pathname);

  return (
    <TocWrapper>
      {indexList.map(({ index, tagName }) => {
        return (
          <ATagStyle
            index={index}
            currentIndex={currentIndex}
            tagName={tagName}
            key={index}
            href={`${pathname}#${index}`}
          >
            {index}
          </ATagStyle>
        );
      })}
    </TocWrapper>
  );
};

const TocWrapper = tw.div`
  fixed right-3 flex flex-col
  w-[300px] h-[100px]
  text-white rounded-md
`;

interface Props {
  index: string;
  currentIndex: string;
  tagName: string;
}

const ATagStyle = styled.a<Props>(({ index, currentIndex, tagName }) => [
  currentIndex === index ? tw`text-black` : tw`text-black/30`,
  tagName === "H2" && tw`ml-[20px]`,
]);
