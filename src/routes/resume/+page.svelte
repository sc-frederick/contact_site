<script lang="ts">
  import { resumeData } from '#lib/resume-data.ts';
  import Timeline from '#lib/components/resume/Timeline.svelte';
  import SkillsSection from '#lib/components/resume/SkillsSection.svelte';
  import DraftArtwork from '#lib/components/effects/DraftArtwork.svelte';
</script>

<div class="min-h-screen">
  <div class="mp-shell max-w-5xl">
    <header class="mp-card resume-header mb-12">
      <div class="resume-identity">
        <div>
          <p class="mp-eyebrow">Profile</p>
          <h1 class="mp-display">
            Stephen <span class="mp-italic">Frederick</span>
          </h1>
          <p class="mp-body mp-body--lg">{resumeData.title}</p>
        </div>
        <DraftArtwork />
      </div>
      <hr class="mp-divider" />
      <h2 class="mp-title">Professional Summary</h2>
      <p class="mp-body mp-body--lg max-w-3xl">
        {resumeData.summary}
      </p>
    </header>

    <section class="mb-12">
      <div class="flex items-center gap-4 mb-8">
        <h2 class="mp-headline">Experience</h2>
        <div class="h-px flex-1 bg-border"></div>
      </div>
      <Timeline items={resumeData.experience} />
    </section>

    <section class="mb-12">
      <div class="flex items-center gap-4 mb-8">
        <h2 class="mp-headline">Education</h2>
        <div class="h-px flex-1 bg-border"></div>
      </div>

      <div class="space-y-6">
        {#each resumeData.education as edu (edu.id)}
          <div class="mp-card mp-card--compact">
            <div
              class="flex flex-col md:flex-row md:items-start md:justify-between gap-2"
            >
              <div>
                <h3 class="mp-title mb-1">
                  {edu.institution}
                </h3>
                <div class="mp-body text-accent">
                  {edu.degree} in {edu.field}
                </div>
                <div class="mp-meta">
                  {edu.location}
                </div>
              </div>
              <div class="mp-meta tabular-nums md:text-right">
                {edu.startDate} — {edu.endDate}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <section>
      <div class="flex items-center gap-4 mb-8">
        <h2 class="mp-headline">Skills</h2>
        <div class="h-px flex-1 bg-border"></div>
      </div>
      <div class="mp-card">
        <SkillsSection categories={resumeData.skills} />
      </div>
    </section>
  </div>
</div>
