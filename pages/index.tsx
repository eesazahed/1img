import { NextPage } from "next";
import Head from "next/head";
import ImageUploadForm from "../components/ImageUploadForm";

const Home: NextPage = () => {
  return (
    <div className="mx-8">
      <Head>
        <title>Upload an image</title>
      </Head>
      <main className="py-16 leading-8 text-xl grid min-h-screen place-items-center">
        <ImageUploadForm />
      </main>
      <p className="py-16 text-center">
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
