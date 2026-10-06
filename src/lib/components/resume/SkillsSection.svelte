<script lang="ts">
  import type { SkillCategory } from '#lib/resume-data.ts';

  let { categories }: { categories: SkillCategory[] } = $props();
</script>

<div class="space-y-8">
  {#each categories as category (category.name)}
    <div>
      <h3 class="mp-title mb-4">
        {category.name}
      </h3>
      <div class="flex flex-wrap gap-2">
        {#each category.skills as skill (skill)}
          <span class="mp-chip">
            {skill}
          </span>
        {/each}
      </div>
    </div>
  {/each}
</div>
