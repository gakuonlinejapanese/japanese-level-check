export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q, page = 0 } = req.query;
  if (!q) return res.status(400).json({ error: "Query required" });

  try {
    // Search Wikimedia Commons for images
    const offset = parseInt(page) * 10;
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=10&gsroffset=${offset}&prop=imageinfo&iiprop=url|size&iiurlwidth=400&format=json&origin=*`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const pages = data?.query?.pages || {};
    const images = Object.values(pages)
      .map(p => p?.imageinfo?.[0]?.thumburl)
      .filter(Boolean);

    return res.status(200).json({ images });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
