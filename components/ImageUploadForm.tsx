import { NextPage } from "next";
import { useState, useRef } from "react";

const ImageUploadForm: NextPage = () => {
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] =
    useState<string>("COPY TO CLIPBOARD");
  const [imageData, setImageData] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setUploadMessage("Uploading...");

    const imageFile = e.currentTarget.image.files?.[0];

    if (!imageFile) {
      setUploadMessage("");
      setErrorMessage("Please select an image.");
      return;
    }

    setFileName(imageFile.name);

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        try {
          const imageData = await convertToWebP(reader.result);
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageData }),
          });

          if (response.ok) {
            const data = await response.json();
            setFileSelected(false);
            setImageData(data.id);
            setErrorMessage("");
            setUploadMessage(`Image uploaded successfully. ID: ${data.id}`);
          } else {
            setUploadMessage("");
            setErrorMessage(`Failed to upload image: ${response.statusText}`);
          }
        } catch (error) {
          setUploadMessage("");
          setErrorMessage(`Error uploading image: ${error}`);
        }
      }
    };

    reader.readAsDataURL(imageFile);
  };

  const convertToWebP = async (imageDataURL: string): Promise<string> => {
    const img = new Image();
    img.src = imageDataURL;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    return canvas.toDataURL("image/webp");
  };

  const copyToClipboard = () => {
    if (imageData) {
      const link = `${window.location.href}api/i/${imageData}`;
      navigator.clipboard.writeText(link).then(() => {
        setCopyButtonText("Copied!");
        setTimeout(() => setCopyButtonText("Copy to clipboard"), 1000);
      });
    }
  };

  const reset = () => {
    setErrorMessage("");
    setUploadMessage("");
    setImageData(null);
  };

  const clearFile = () => {
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setFileName(null);
      setFileSelected(false);
    }
  };

  return (
    <div className="mx-auto w-[500px]">
      <h1 className="text-center text-xl text-wrap mb-8">
        Anything you upload here will be public.
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 w-full"
      >
        <label
          htmlFor="image"
          className="flex items-center justify-center w-full py-2 px-4 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-300 dark:text-black"
        >
          Select Image File
          <input
            type="file"
            accept="image/*"
            name="image"
            id="image"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              reset();
              setFileSelected(true);
              setFileName(String(e.currentTarget.files?.[0].name) || null);
            }}
          />
        </label>
        <button
          type="submit"
          className={`w-full py-2 px-6 text-white rounded-lg shadow-md transition duration-300 ${
            fileSelected
              ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              : "bg-gray-500 cursor-not-allowed"
          }`}
          disabled={!fileSelected}
        >
          Upload Image
        </button>
        {fileName && (
          <div className="flex items-center justify-between w-full py-2">
            <p className="truncate">{fileName}</p>
            <button
              type="button"
              onClick={clearFile}
              className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
            >
              &#x2715;
            </button>
          </div>
        )}
      </form>
      <div className="mt-4 text-center">
        <div className="my-8 text-lg">
          {uploadMessage && <p className="text-green-500">{uploadMessage}</p>}
          {errorMessage && <p className="text-yellow-500">{errorMessage}</p>}
        </div>
        {imageData && (
          <button
            onClick={copyToClipboard}
            className="w-full py-2 px-6 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
          >
            {copyButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploadForm;
