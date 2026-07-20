"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8090";

export function ArchiveItemUploadForm() {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setUploadError("Please select an image file.");
      return;
    }
    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("altText", altText);
    formData.append("caption", caption);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Upload failed");
      setUploadSuccess(true);
      setFile(null);
      setAltText("");
      setCaption("");
    } catch (requestError) {
      setUploadError(requestError instanceof Error ? requestError.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="upload-panel">
      <h2>Upload Archive Image</h2>
      <form onSubmit={onSubmit}>
        <label>
          Image file
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            required
          />
        </label>
        <label>
          Alt text
          <input
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Descriptive text for accessibility"
            required
          />
        </label>
        <label>
          Caption
          <input
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Optional display caption"
          />
        </label>
        {uploadError ? <p className="error-banner">{uploadError}</p> : null}
        {uploadSuccess ? <p className="notice">Image uploaded successfully!</p> : null}
        <button className="button" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>
    </section>
  );
}

