import { Metadata } from 'next';
import { getMetaDocs, handleMetaPage } from '@/lib/meta-store';
import { fixID } from '@/lib/util';
import { DocPageLayout } from '@/components/DocPageLayout';

interface PageProps {
  params: Promise<{ id?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: idParts } = await params;
  const id = fixID(idParts ? idParts.join('/') : null);
  const title = (id ? `Search '${id}' | ` : '') + 'Language Explanations | DenizenM Meta Documentation';
  const desc = id ? `Language Explanation search for '${id}'` : 'Language Explanation List';
  return {
    title,
    description: desc,
  };
}

export default async function LanguagesPage({ params }: PageProps) {
  const { id: idParts } = await params;
  const id = fixID(idParts ? idParts.join('/') : null);
  const docs = await getMetaDocs();
  const langList = Object.values(docs.languages);

  const model = handleMetaPage(langList, id);

  return (
    <DocPageLayout
      title="DenizenM Script Language Explanations"
      description={
        <>
          <br />
          Language Explanations explain components of DenizenM in a more direct and technical way than{' '}
          <a href="https://guide.denizenscript.com/">The Beginner&apos;s Guide</a>.
        </>
      }
      searchPlaceholder="Search Language Explanations..."
      itemPlural="language explanations"
      basePath="/Docs/Languages"
      model={model}
    />
  );
}
