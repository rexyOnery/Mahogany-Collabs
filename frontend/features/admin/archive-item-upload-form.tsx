"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ImagePlus, UploadCloud } from "lucide-react";
import { FieldHelpLabel, useFieldHelp } from "@/components/field-help-label";
import { useAuth } from "@/hooks/use-auth";
import { archiveImageUrl, createArchiveItem } from "@/services/archive-service";
import type { ArchiveItem } from "@/types/archive";

const MAX_ARCHIVE_IMAGE_BYTES = 10 * 1024 * 1024;
const allowedArchiveImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/tiff"
]);

const fieldHelpText = {
  archiveImage:
    "The digital image file for this archive record. Choose a JPEG, PNG, WebP, GIF, or TIFF file up to 10 MB.",
  title:
    "The main name shown for this item in search results and on its public archive record.",
  materialType:
    "The broad format of the original item, such as an image, book, manuscript, audio recording, object, or map. This is not the uploaded file format.",
  rightsStatus:
    "What is known about copyright or permission to use and reproduce this item, such as public domain, licensed, or under review.",
  accessLevel:
    "Who can view this record. Public items are searchable by everyone; restricted and private items are not publicly discoverable.",
  shortDescription:
    "A brief one- or two-sentence summary shown on archive cards and in search results.",
  publicContent:
    "The fuller description visitors will read on the public archive record. Include useful historical context and details.",
  altText:
    "A concise description of what is visible in the image for people using screen readers. Describe meaningful visual details rather than repeating the caption.",
  creator:
    "The person, group, or institution that made the original item, if known.",
  dateOrPeriod:
    "When the original item was created or used. Enter an exact date, year, range, or historical period.",
  country:
    "The country most directly associated with the item's creation, subject, or origin.",
  region:
    "A broader geographic area associated with the item, such as West Africa or the Caribbean.",
  community:
    "The specific community, town, site, or cultural group connected to the item.",
  language: "The main language used in or associated with the item.",
  subjectTags:
    "Broad topics used to group and filter records. Separate multiple subject tags with commas.",
  keywords:
    "Specific search terms or alternate names that help visitors find the item. Separate multiple keywords with commas.",
  sourceOrDonor:
    "Where the item came from, or the person or organization that donated or supplied it.",
  culturalSensitivityLabel:
    "A public notice for culturally sensitive, sacred, restricted, or potentially distressing content.",
  caption:
    "A short display caption that identifies the image and gives essential context.",
  internalNotes:
    "Private administrative notes for archive staff. These notes are not displayed on the public record."
} as const;

type FieldHelpKey = keyof typeof fieldHelpText;

type AdminFieldLabelProps = {
  fieldId: string;
  helpKey: FieldHelpKey;
  label: string;
  openHelp: FieldHelpKey | null;
  onToggle: (helpKey: FieldHelpKey) => void;
};

function AdminFieldLabel({
  fieldId,
  helpKey,
  label,
  openHelp,
  onToggle
}: AdminFieldLabelProps) {
  return (
    <FieldHelpLabel
      fieldId={fieldId}
      helpKey={helpKey}
      label={label}
      description={fieldHelpText[helpKey]}
      openHelp={openHelp}
      onToggle={onToggle}
    />
  );
}

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
  const { openHelp, toggleHelp } = useFieldHelp<FieldHelpKey>();

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
    const selectedImage = event.target.files?.[0] ?? null;

    if (selectedImage && !allowedArchiveImageTypes.has(selectedImage.type)) {
      event.target.value = "";
      setImage(null);
      setError("Choose a JPEG, PNG, WebP, GIF, or TIFF image.");
      return;
    }

    if (selectedImage && selectedImage.size > MAX_ARCHIVE_IMAGE_BYTES) {
      event.target.value = "";
      setImage(null);
      setError("Archive images must be 10 MB or smaller.");
      return;
    }

    setImage(selectedImage);
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
        <div className="image-upload-field">
          <AdminFieldLabel
            fieldId="archive-image"
            helpKey="archiveImage"
            label="Archive image"
            openHelp={openHelp}
            onToggle={toggleHelp}
          />
          <div className="image-dropzone">
            <input
              id="archive-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/tiff"
              onChange={onImageChange}
            />
            <label className="image-dropzone-picker" htmlFor="archive-image">
              {previewUrl ? (
                <>
                  <span className="sr-only">Choose a different archive image</span>
                  <img src={previewUrl} alt="Selected archive upload preview" />
                </>
              ) : (
                <strong>
                  <UploadCloud size={22} />
                  Choose image
                </strong>
              )}
            </label>
            {image ? <small>{image.name}</small> : null}
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-title"
              helpKey="title"
              label="Title"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-title"
              required
              value={form.title}
              onChange={updateField("title")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-material-type"
              helpKey="materialType"
              label="Material type"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <select
              id="archive-material-type"
              value={form.materialType}
              onChange={updateField("materialType")}
            >
              <option>Images</option>
              <option>Books</option>
              <option>Manuscripts</option>
              <option>Audio</option>
              <option>Objects</option>
              <option>Maps</option>
              <option>Language</option>
              <option>Research</option>
            </select>
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-rights-status"
              helpKey="rightsStatus"
              label="Rights status"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-rights-status"
              required
              value={form.rightsStatus}
              onChange={updateField("rightsStatus")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-access-level"
              helpKey="accessLevel"
              label="Access level"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <select
              id="archive-access-level"
              value={form.accessLevel}
              onChange={updateField("accessLevel")}
            >
              <option value="public">Public</option>
              <option value="restricted">Restricted</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="admin-form-field wide-field">
            <AdminFieldLabel
              fieldId="archive-short-description"
              helpKey="shortDescription"
              label="Short description"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <textarea
              id="archive-short-description"
              required
              rows={3}
              value={form.shortDescription}
              onChange={updateField("shortDescription")}
            />
          </div>
          <div className="admin-form-field wide-field">
            <AdminFieldLabel
              fieldId="archive-public-content"
              helpKey="publicContent"
              label="Public content"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <textarea
              id="archive-public-content"
              required
              rows={5}
              value={form.publicContent}
              onChange={updateField("publicContent")}
            />
          </div>
          <div className="admin-form-field wide-field">
            <AdminFieldLabel
              fieldId="archive-alt-text"
              helpKey="altText"
              label="Alt text"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-alt-text"
              required
              value={form.altText}
              onChange={updateField("altText")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-creator"
              helpKey="creator"
              label="Creator"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-creator"
              value={form.creator}
              onChange={updateField("creator")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-date-or-period"
              helpKey="dateOrPeriod"
              label="Date or period"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-date-or-period"
              value={form.dateOrPeriod}
              onChange={updateField("dateOrPeriod")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-country"
              helpKey="country"
              label="Country"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-country"
              value={form.country}
              onChange={updateField("country")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-region"
              helpKey="region"
              label="Region"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-region"
              value={form.region}
              onChange={updateField("region")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-community"
              helpKey="community"
              label="Community or place"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-community"
              value={form.community}
              onChange={updateField("community")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-language"
              helpKey="language"
              label="Language"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-language"
              value={form.language}
              onChange={updateField("language")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-subject-tags"
              helpKey="subjectTags"
              label="Subject tags"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-subject-tags"
              placeholder="portrait, family archive"
              value={form.subjectTags}
              onChange={updateField("subjectTags")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-keywords"
              helpKey="keywords"
              label="Keywords"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-keywords"
              placeholder="comma-separated"
              value={form.keywords}
              onChange={updateField("keywords")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-source-or-donor"
              helpKey="sourceOrDonor"
              label="Source or donor"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-source-or-donor"
              value={form.sourceOrDonor}
              onChange={updateField("sourceOrDonor")}
            />
          </div>
          <div className="admin-form-field">
            <AdminFieldLabel
              fieldId="archive-sensitivity-label"
              helpKey="culturalSensitivityLabel"
              label="Sensitivity label"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-sensitivity-label"
              value={form.culturalSensitivityLabel}
              onChange={updateField("culturalSensitivityLabel")}
            />
          </div>
          <div className="admin-form-field wide-field">
            <AdminFieldLabel
              fieldId="archive-caption"
              helpKey="caption"
              label="Caption"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <input
              id="archive-caption"
              value={form.caption}
              onChange={updateField("caption")}
            />
          </div>
          <div className="admin-form-field wide-field">
            <AdminFieldLabel
              fieldId="archive-internal-notes"
              helpKey="internalNotes"
              label="Internal notes"
              openHelp={openHelp}
              onToggle={toggleHelp}
            />
            <textarea
              id="archive-internal-notes"
              rows={3}
              value={form.internalNotes}
              onChange={updateField("internalNotes")}
            />
          </div>
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
