import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import {
  extractArchiveImageInfo,
  getPublicArchiveItemFilters,
  normalizeArchiveListLimit
} from "../src/services/archive.service.js";
import { createArchiveItemSchema } from "../src/validation/archive-item.validation.js";

test("archive image extraction captures technical metadata", async () => {
  const buffer = await sharp({
    create: {
      width: 12,
      height: 8,
      channels: 3,
      background: "#fffaf1"
    }
  })
    .png()
    .toBuffer();

  const info = await extractArchiveImageInfo({
    buffer,
    originalname: "community-record.png",
    mimetype: "image/png",
    size: buffer.length
  });

  assert.equal(info.originalFilename, "community-record.png");
  assert.equal(info.mimeType, "image/png");
  assert.equal(info.fileSize, buffer.length);
  assert.equal(info.width, 12);
  assert.equal(info.height, 8);
  assert.equal(info.format, "png");
  assert.match(info.checksum, /^[a-f0-9]{64}$/);
});

test("archive image extraction rejects non-image buffers", async () => {
  await assert.rejects(
    () =>
      extractArchiveImageInfo({
        buffer: Buffer.from("not an image"),
        originalname: "notes.txt",
        mimetype: "text/plain",
        size: 12
      }),
    /could not be read as an image/
  );
});

test("public archive filters only expose published public items", () => {
  const filters = getPublicArchiveItemFilters({
    search: "portrait",
    materialType: "Images",
    region: "West Africa",
    language: "Yoruba"
  });

  assert.equal(filters.publicationStatus, "published");
  assert.equal(filters.accessLevel, "public");
  assert.deepEqual(filters.$text, { $search: "portrait" });
  assert.equal(filters.materialType.test("Images"), true);
  assert.equal(filters.region.test("West Africa"), true);
  assert.equal(filters.language.test("Yoruba"), true);
});

test("archive item validation turns comma fields into arrays", () => {
  const result = createArchiveItemSchema.parse({
    title: "Family Portrait",
    shortDescription: "A community family portrait from the archive.",
    materialType: "Images",
    rightsStatus: "Rights under review",
    accessLevel: "public",
    altText: "A family portrait in an archive collection",
    publicContent: "This public record preserves context about the image.",
    subjectTags: "portrait, family archive, community",
    keywords: "diaspora, heritage"
  });

  assert.deepEqual(result.subjectTags, ["portrait", "family archive", "community"]);
  assert.deepEqual(result.keywords, ["diaspora", "heritage"]);
});

test("archive item search limit stays inside launch bounds", () => {
  assert.equal(normalizeArchiveListLimit("0"), 1);
  assert.equal(normalizeArchiveListLimit("12"), 12);
  assert.equal(normalizeArchiveListLimit("1000"), 50);
  assert.equal(normalizeArchiveListLimit("not-a-number"), 20);
});
