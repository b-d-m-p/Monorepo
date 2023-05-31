import Surveys from "~/app/[lang]/Surveys";
import { fetchSurveysMetadata } from "~/lib/api/fetch";
import { initRedis } from "@devographics/redis";
import { serverConfig } from "~/config/server";
import { cache } from "react";

import { locales } from "~/i18n/data/locales";
export function generateStaticParams() {
  return locales.map((l) => ({ lang: l }));
}

const rscFetchSurveysMetadata = cache(async () => {
  const surveys = await fetchSurveysMetadata({ calledFrom: __filename });
  if (serverConfig().isProd && !serverConfig()?.isTest) {
    return surveys.filter((s) => s.id !== "demo_survey");
  }
  return surveys;
});

const IndexPage = async ({ params }) => {
  initRedis(serverConfig().redisUrl);
  const surveys = await rscFetchSurveysMetadata();
  return <Surveys localeId={params.lang} surveys={surveys} />;
};

export default IndexPage;
