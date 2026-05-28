function slugify(name) {
  const base = String(name || "group")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "group";
}

async function uniqueSlug(Model, name) {
  const base = slugify(name);
  let slug = base;
  let suffix = 0;

  while (await Model.findOne({ slug })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  return slug;
}

module.exports = { slugify, uniqueSlug };
