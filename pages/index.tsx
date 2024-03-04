import { NextPage } from "next";
import Head from "next/head";
import ImageUploadForm from "../components/ImageUploadForm";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Upload an image</title>
      </Head>
      <main className="pt-64 w-full min-h-screen leading-8 text-xl">
        <ImageUploadForm />
      </main>
      <p className="mb-16 text-center">
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
