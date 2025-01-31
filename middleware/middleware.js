// middleware.js
import { NextResponse } from "next/server";
import { layoutService } from "@sitecore-jss/sitecore-jss-nextjs";

export async function middleware(request) {
  console.log(22, "siteApiKey");
  console.log(siteName, siteApiKey);

  // Get the URL from the request
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname;

  // Sitecore Context required: Site name  and the site api key (defined in the .env file or similar)
  const siteName = `${process.env.NEXT_PUBLIC_SITE_NAME}`;
  const siteApiKey = `${process.env.SITECORE_API_KEY}`;

  // JSS Sitecore config specific
  const layoutServiceClient = layoutService.createDefaultLayoutService({
    apiHost: `${process.env.NEXT_PUBLIC_SITECORE_API_HOST}`,
    apiKey: siteApiKey,
    siteName: siteName,
  });

  // Resolve Sitecore Item with the given path
  try {
    const layoutData = await layoutServiceClient.fetchLayoutData(path);

    // Check if a valid item was retrieved. The layoutData object has the item object that contains the path propery
    if (layoutData?.sitecore?.route?.path) {
      //  Do something here with the virtual path e.g. log to console
      const sitecorePath = layoutData?.sitecore?.route?.path;
      console.log("Sitecore virtual path:", sitecorePath);
    }
  } catch (err) {
    console.error("Sitecore layoutService failure", err);
  }

  // If we have got this far, just return the original request.
  return NextResponse.next();
}

// Add matcher if needed to intercept request to match the path that this middlware works on.
export const config = {
  matcher: ["/"],
};
