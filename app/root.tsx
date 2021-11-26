import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
} from "remix";
import type { MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "GitHub Chat | A chat room for every GitHub repository",
    description: "A chat room for every GitHub repository",
    // Open graph & Facebook
    "og:type": "website",
    "og:url": "https://github-chat.com/",
    "og:title": "GitHub Chat | A chat room for every GitHub repository",
    "og:description": "A chat room for every GitHub repository",
    "og:image": "https://github-chat.com/meta-image.png",
    // Twitter
    "twitter:card": "summary_large_image",
    "twitter:url": "https://github-chat.com/",
    "twitter:title": "GitHub Chat | A chat room for every GitHub repository",
    "twitter:description": "A chat room for every GitHub repository",
    "twitter:image": "https://github-chat.com/meta-image.png"
  };
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <div>
        <h1>There was an error</h1>
        <p>{error.message}</p>
        <hr />
        <p>
          Hey, developer, you should replace this with what you want your
          users to see.
        </p>
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <h1>
        {caught.status}: {caught.statusText}
      </h1>
      {message}
    </Document>
  );
}

function Document({
  children,
  title
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}