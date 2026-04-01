export async function getGithubStars(repo = 'atakanclskn/sakai_downloader') {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: controller.signal
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.stargazers_count;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}