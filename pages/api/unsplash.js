export default async function getRandomWallpaper(req, res) {
    const UNSPLASH_URL = `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_KEY}&orientation=landscape&query=nature&topics=wallpapers`
    const response = await fetch(UNSPLASH_URL);
    if(response.status == 200) {
        const data = await response.json();
        res.status(200).json(data);
    } else {
        console.log("ERROR", response.status, response.statusText);
        res.status(response.status).json({ error: true });
    }
}