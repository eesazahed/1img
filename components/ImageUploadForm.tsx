import { NextPage } from "next";
import { useState, useRef } from "react";

const ImageUploadForm: NextPage = () => {
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] =
    useState<string>("COPY TO CLIPBOARD");
  const [imageData, setImageData] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState<boolean>(false);

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

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageBase64: reader.result }),
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

  const copyToClipboard = () => {
    if (imageData) {
      const link = `${window.location.href}api/i/${imageData}`;
      navigator.clipboard.writeText(link).then(() => {
        setCopyButtonText("COPIED!");
        setTimeout(() => setCopyButtonText("COPY TO CLIPBOARD"), 1000);
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 w-[500px]"
      >
        <label
          htmlFor="image"
          className="flex items-center justify-center w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-300"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Choose Image
          <input
            type="file"
            accept="image/*"
            name="image"
            id="image"
            ref={fileInputRef}
            className="hidden"
            onChange={() => setFileSelected(true)}
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
      </form>
      <div className="mt-4 text-center">
        <div className="my-8">
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
