import type { NextPage } from "next";
import tw from "twin.macro";

const Home: NextPage = () => {
  return <Test>Hello world!</Test>;
};

const Test = tw.div`
  text-3xl font-bold underline
`;

export default Home;
