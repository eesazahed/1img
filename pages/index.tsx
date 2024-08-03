import { NextPage } from "next";
import Head from "next/head";
import ImageUploadForm from "../components/ImageUploadForm";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Upload an image</title>
      </Head>
      <main className="pt-32 w-full min-h-screen leading-8 text-xl">
        <h1 className="text-7xl font-bold bg-gradient-to-r from-[#4b0bff] to-[#68b2ff] bg-clip-text text-transparent dark:from-[#4facfe] dark:to-[#00f2fe] text-center pb-8 mb-8">
          1img
        </h1>
        <ImageUploadForm />
      </main>
      <p className="my-16 text-center">
        Made by{" "}
        <a
          className="text-green-400"
          rel="noreferrer"
          target="_blank"
          href="https://eesa.zahed.ca/"
        >
          Eesa Zahed
        </a>
      </p>
    </div>
  );
};

export default Home;
