import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import { ReactNode } from "react";
import "./styles.css";
import { PreloadResources } from "./preloaded-resources";

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const banner = <Banner dismissible={false}>Face tryon (beta) 🎉</Banner>;
const navbar = <Navbar logo={<b>Face Tryon (beta)</b>} />;
const footer = <Footer></Footer>;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
        <PreloadResources />
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/breathingcyborg/face-tryon/tree/main/apps/docs"
          footer={footer}
          darkMode={false}
          search={false}
          nextThemes={{ defaultTheme: "dark" }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
