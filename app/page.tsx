import { CHAPTERS } from './content/chapters';

export default function StoryPage() {
  return (
    <>
      <h1>Living Archive — DNA Libraries</h1>
      <p><em>DREAMSCAPES &amp; ORGANOIDS</em></p>
      <p>Storing cultural archives in zebrafish DNA. Building a temple where the archive swims, reproduces, and outlives us all.</p>
      <p>Henry Tan &amp; Carmen Koessler · NYUAD CGSB</p>

      <hr />

      {CHAPTERS.map((ch) => (
        <section key={ch.id} id={ch.id}>
          <h2>Chapter {String(ch.number).padStart(2, '0')}: {ch.title}</h2>
          {ch.render()}
          <hr />
        </section>
      ))}

      <section>
        <h2>Get involved</h2>
        <p>The archive is alive. Help it grow.</p>
        <p>We&apos;re looking for collaborators, funders, and institutions who want to explore DNA as a medium for cultural preservation.</p>
        <p>
          <a href="mailto:livingarchive@proton.me">Email us</a> ·{' '}
          <a href="https://github.com/henryandpartners/living-archive-web">GitHub</a> ·{' '}
          <a href="/publications">Publications</a>
        </p>
      </section>
    </>
  );
}
