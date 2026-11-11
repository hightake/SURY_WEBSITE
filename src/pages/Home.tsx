import { BrandWorlds } from "../components/home/BrandWorlds";
import { ContactBlock } from "../components/home/ContactBlock";
import { Hero } from "../components/home/Hero";
import { NewCollection } from "../components/home/NewCollection";
import { StoresBlock } from "../components/home/StoresBlock";
import { StoryTeaser } from "../components/home/StoryTeaser";
import { Uniqueness } from "../components/home/Uniqueness";
import { usePageTitle } from "../lib/usePageTitle";

export function Home() {
  usePageTitle();
  return (
    <>
      <Hero />
      <BrandWorlds />
      <NewCollection />
      <Uniqueness />
      <StoryTeaser />
      <StoresBlock />
      <ContactBlock />
    </>
  );
}
