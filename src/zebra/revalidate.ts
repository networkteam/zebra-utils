import { revalidateTag } from 'next/cache';

/**
 * Handle a POST request to revalidate the document cache.
 *
 * This is a simple implementation that invalidates all document cache entries of the
 * fetch cache on any published change in Neos.
 *
 * If suitable, individual route paths could be invalidated based on the payload sent by Neos
 * by using the `revalidateTag` function with the appropriate `document:[routePath]` tag.
 *
 * Since Next.js will only flush the cache entries the actual re-rendering will be performed
 * lazy on the next request to the affected routes.
 */
const revalidate = async (req: Request) => {
  // Check for secret to confirm this is a valid request
  if (req.headers.get('authorization') !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
    console.warn('Invalid token for revalidate request');

    return Response.json(
      { error: 'Invalid token', revalidated: false },
      {
        status: 401,
      }
    );
  }

  console.info('/api/revalidate', 'Revalidating document cache');

  revalidateTag('document');

  return Response.json({ revalidated: true });
};

export default revalidate;
