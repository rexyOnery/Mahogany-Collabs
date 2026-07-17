"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ImagePlus, UploadCloud } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { archiveImageUrl, createArchiveItem } from "@/services/archive-service";
import type { ArchiveItem } from "@/types/archive";

const defaultForm = {
  title: "",
  shortDescription: "",
  materialType: "Images",
  rightsStatus: "Rights under review",
  accessLevel: "public",
  altText: "",
  publicContent: "",
  creator: "",
  dateOrPeriod: "",
  country: "",
  region: "",
  community: "",
  language: "",
  subjectTags: "",
  keywords: "",
  sourceOrDonor: "",
  culturalSensitivityLabel: "",
  caption: "",
  internalNotes: ""
};

export function ArchiveItemUploadForm() {
  const { token } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedItem, setSavedItem] = useState<ArchiveItem | null>(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const updateField =
    (field: keyof typeof defaultForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value
      }));
    };

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files?.[0] ?? null);
    setSavedItem(null);
    setError("");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSavedItem(null);

    if (!token) {
      setError("Admin session is required before uploading an archive item.");
      return;
    }

    if (!image) {
      setError("Choose an image before saving the archive item.");
      return;
    }

    const data = new FormData();
    data.set("image", image);
    Object.entries(form).forEach(([key, value]) => data.set(key, value));

    setSaving(true);
    try {
      const created = await createArchiveItem(data, token);
      setSavedItem(created);
      setForm(defaultForm);
      setImage(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-upload-panel">
      <div className="admin-upload-heading">
        <div>
          <p className="eyebrow">Lean V1 record entry</p>
          <h2>Upload an archive image</h2>
          <p>
            Save a public image record directly to the archive database with
            extracted technical metadata and searchable public description.
          </p>
        </div>
        <ImagePlus size={32} aria-hidden="true" />
      </div>

      <form className="admin-upload-form" onSubmit={onSubmit}>
        <label className="image-dropzone">
          <span>Archive image</span>
          <input type="file" accept="image/*" onChange={onImageChange} />
          {previewUrl ? (
            <img src={previewUrl} alt="Selected archive upload preview" />
          ) : (
            <strong>
              <UploadCloud size={22} />
              Choose image
            </strong>
          )}
          {image ? <small>{image.name}</small> : null}
        </label>

        <div className="admin-form-grid">
          <label>
            Title
            <input required value={form.title} onChange={updateField("title")} />
          </label>
          <label>
            Material type
            <select value={form.materialType} onChange={updateField("materialType")}>
              <option>Images</option>
              <option>Books</option>
              <option>Manuscripts</option>
              <option>Objects</option>
              <option>Maps</option>
              <option>Language</option>
              <option>Research</option>
            </select>
          </label>
          <label>
            Rights status
            <input
              required
              value={form.rightsStatus}
              onChange={updateField("rightsStatus")}
            />
          </label>
          <label>
            Access level
            <select value={form.accessLevel} onChange={updateField("accessLevel")}>
              <option value="public">Public</option>
              <option value="restricted">Restricted</option>
              <option value="private">Private</option>
            </select>
          </label>
          <label className="wide-field">
            Short description
            <textarea
              required
              rows={3}
              value={form.shortDescription}
              onChange={updateField("shortDescription")}
            />
          </label>
          <label className="wide-field">
            Public content
            <textarea
              required
              rows={5}
              value={form.publicContent}
              onChange={updateField("publicContent")}
            />
          </label>
          <label className="wide-field">
            Alt text
            <input required value={form.altText} onChange={updateField("altText")} />
          </label>
          <label>
            Creator
            <input value={form.creator} onChange={updateField("creator")} />
          </label>
          <label>
            Date or period
            <input value={form.dateOrPeriod} onChange={updateField("dateOrPeriod")} />
          </label>
          <label>
            Country
            <input value={form.country} onChange={updateField("country")} />
          </label>
          <label>
            Region
            <input value={form.region} onChange={updateField("region")} />
          </label>
          <label>
            Community or place
            <input value={form.community} onChange={updateField("community")} />
          </label>
          <label>
            Language
            <input value={form.language} onChange={updateField("language")} />
          </label>
          <label>
            Subject tags
            <input
              placeholder="portrait, family archive"
              value={form.subjectTags}
              onChange={updateField("subjectTags")}
            />
          </label>
          <label>
            Keywords
            <input
              placeholder="comma-separated"
              value={form.keywords}
              onChange={updateField("keywords")}
            />
          </label>
          <label>
            Source or donor
            <input value={form.sourceOrDonor} onChange={updateField("sourceOrDonor")} />
          </label>
          <label>
            Sensitivity label
            <input
              value={form.culturalSensitivityLabel}
              onChange={updateField("culturalSensitivityLabel")}
            />
          </label>
          <label className="wide-field">
            Caption
            <input value={form.caption} onChange={updateField("caption")} />
          </label>
          <label className="wide-field">
            Internal notes
            <textarea
              rows={3}
              value={form.internalNotes}
              onChange={updateField("internalNotes")}
            />
          </label>
        </div>

        {error ? <p className="error-banner">{error}</p> : null}

        <button className="button" type="submit" disabled={saving}>
          <UploadCloud size={18} />
          {saving ? "Saving..." : "Save Archive Item"}
        </button>
      </form>

      {savedItem ? (
        <section className="upload-result-panel" aria-live="polite">
          <div>
            <h3>{savedItem.title} saved</h3>
            <p>
              {savedItem.image.width} x {savedItem.image.height}px ·{" "}
              {(savedItem.image.fileSize / 1024).toFixed(1)} KB ·{" "}
              {savedItem.image.format.toUpperCase()}
            </p>
            {savedItem.accessLevel !== "public" ||
            savedItem.publicationStatus !== "published" ? (
              <p>This item is saved, but it is not public-searchable yet.</p>
            ) : null}
          </div>
          {savedItem.accessLevel === "public" &&
          savedItem.publicationStatus === "published" ? (
            <>
              <Link className="button button-light" href={`/archive/${savedItem.slug}`}>
                View public record
              </Link>
              <img src={archiveImageUrl(savedItem)} alt={savedItem.altText} />
            </>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
