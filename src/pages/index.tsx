import type { NextPage } from "next";
import tw from "twin.macro";
import { Quill } from "~/components/editors/quill";

const Home: NextPage = () => {
  return (
    <div>
      <Quill />
    </div>
  );
};

const Test = tw.div`
  text-3xl font-bold underline
`;

export default Home;
