<script setup lang="ts">
const { t, locale } = useI18n()

useSeo({
  useTranslation: true,
  translationKey: 'seo.pages.resume',
  type: 'profile',
  image: '/images/profile.jpg',
  imageAlt: 'Jakub Tutka Resume - Full-stack Developer CV',
})

const { addPerson, addBreadcrumbs } = useStructuredData()

addPerson({
  name: 'Jakub Tutka',
  jobTitle: locale.value === 'en'
    ? 'Full-stack Developer'
    : 'Programista Full-stack',
  email: 'jakubtutka02@gmail.com',
  image: '/images/profile.jpg',
  description: t('seo.pages.resume.description'),
  socialLinks: [
    'https://github.com/JakubTuta',
    'https://www.linkedin.com/in/jakub-tutka-077b55352/',
    'https://jakubtutka.com',
  ],
})

addBreadcrumbs([
  { name: 'Home', item: '/' },
  { name: 'Resume', item: '/resume' },
])

const resume = RESUME_DATA

const personalInfo = resume.personalInfo
const education = resume.education
const workExperience = resume.workExperience
const highlightedProjects = resume.highlightedProjects
const skills = resume.skills
const interests = resume.interests
const links = resume.links

function getTranslatedText(text: { en: string, pl: string } | string) {
  if (typeof text === 'string')
    return text

  return locale.value === 'en'
    ? text.en
    : text.pl
}

function handlePrint() {
  if (!import.meta.server) {
    const a = document.createElement('a')

    if (locale.value === 'en') {
      a.href = `/files/Jakub_Tutka_Resume_EN_2.pdf`
      a.download = `Jakub_Tutka_Resume_EN_2.pdf`
    }
    else if (locale.value === 'pl') {
      a.href = '/files/Jakub_Tutka_CV_PL_2.pdf'
      a.download = 'Jakub_Tutka_CV_PL_2.pdf'
    }
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

function printPage() {
  if (!import.meta.server)
    window.print()
}

function datePeriod(start: Date, end: Date | null): string {
  const startYear = start.getFullYear()
  const startMonth = (start.getMonth() + 1).toString().padStart(2, '0')

  if (end === null) {
    return locale.value === 'en'
      ? `${startMonth}.${startYear} — present`
      : `${startMonth}.${startYear} — obecnie`
  }

  const endYear = end.getFullYear()
  const endMonth = (end.getMonth() + 1).toString().padStart(2, '0')

  return `${startMonth}.${startYear} — ${endMonth}.${endYear}`
}

function calculateDate(date1: Date, date2: Date | null): string {
  const endDate = date2 || new Date()

  const diffTime = Math.abs(endDate.getTime() - date1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const years = Math.floor(diffDays / 365)
  const months = Math.floor((diffDays % 365) / 30)

  const parts = []

  if (years > 0) {
    parts.push(locale.value === 'en'
      ? `${years} yr${years > 1
        ? 's'
        : ''}`
      : `${years} ${years === 1
        ? 'rok'
        : (years.toString().endsWith('2') || years.toString().endsWith('3') || years.toString().endsWith('4'))
            ? 'lata'
            : 'lat'}`,
    )
  }

  if (months > 0) {
    parts.push(locale.value === 'en'
      ? `${months} mo${months > 1
        ? 's'
        : ''}`
      : `${months} ${months === 1
        ? 'miesiąc'
        : (months.toString().endsWith('2') || months.toString().endsWith('3') || months.toString().endsWith('4'))
            ? 'miesiące'
            : 'miesięcy'}`,
    )
  }

  return parts.join(locale.value === 'en'
    ? ' '
    : ' ')
}
</script>

<template>
  <div>
    <!-- ── Hero ───────────────────────────────── -->
    <section class="wrap resume-hero">
      <div class="rh-top">
        <Reveal>
          <span class="eyebrow">Curriculum Vitae</span>

          <h1 class="rh-name">
            {{ personalInfo.name }}
          </h1>

          <p class="rh-role">
            {{ getTranslatedText(personalInfo.title) }}
          </p>
        </Reveal>

        <Reveal
          :delay="1"
          class="dl-actions"
        >
          <button
            type="button"
            class="btn btn-primary"
            @click="handlePrint"
          >
            <v-icon size="16">
              mdi-download
            </v-icon>
            {{ locale === 'en'
              ? 'Download résumé (PDF)'
              : 'Pobierz CV (PDF)' }}
          </button>

          <button
            type="button"
            class="btn btn-ghost"
            @click="printPage"
          >
            <v-icon size="16">
              mdi-printer
            </v-icon>
            {{ locale === 'en'
              ? 'Print this page'
              : 'Drukuj tę stronę' }}
          </button>
        </Reveal>
      </div>

      <Reveal
        :delay="2"
        class="contact-row"
      >
        <span class="cchip">
          <v-icon
            size="14"
            color="accent"
          >mdi-email-outline</v-icon>

          <a :href="`mailto:${personalInfo.email}`">{{ personalInfo.email }}</a>
        </span>

        <span class="cchip">
          <v-icon
            size="14"
            color="accent"
          >mdi-phone-outline</v-icon>
          {{ personalInfo.phone }}
        </span>

        <span class="cchip">
          <v-icon
            size="14"
            color="accent"
          >mdi-map-marker-outline</v-icon>
          {{ getTranslatedText(personalInfo.location) }}
        </span>

        <span class="cchip">
          <v-icon
            size="14"
            color="accent"
          >mdi-cake-variant-outline</v-icon>
          {{ locale === 'en'
            ? 'Born'
            : 'Ur.' }} {{ personalInfo.birthDate }}
        </span>
      </Reveal>
    </section>

    <!-- ── Body ──────────────────────────────── -->
    <section
      class="wrap section"
      style="padding-top: 8px;"
    >
      <div class="resume-grid">
        <!-- MAIN -->
        <div class="main-col">
          <!-- Summary -->
          <Reveal class="block">
            <p class="r-summary">
              {{ locale === 'en'
                ? 'Backend-focused software engineer with 3+ years of professional experience designing and deploying scalable server-side systems. I specialise in Python (FastAPI, Django) with a strong emphasis on API performance optimization, database design and microservice architecture. I run production workloads on Google Cloud Platform and approach backend development with an engineering mindset — clear architecture, documented APIs and infrastructure that scales reliably under load.'
                : 'Inżynier oprogramowania skupiony na backendzie z ponad 3-letnim doświadczeniem zawodowym w projektowaniu i wdrażaniu skalowalnych systemów. Specjalizuję się w Pythonie (FastAPI, Django) z naciskiem na optymalizację wydajności API, projektowanie baz danych i architekturę mikroserwisów. Uruchamiam produkcyjne obciążenia na Google Cloud Platform i podchodzę do backendowego programowania z inżynierskim nastawieniem.'
              }}
            </p>
          </Reveal>

          <!-- Experience -->
          <Reveal class="block">
            <h2 class="block-title">
              {{ t('resume.work.title') }}
            </h2>

            <div class="tl">
              <div
                v-for="(exp, index) in workExperience"
                :key="index"
                class="tl-item"
              >
                <div class="when">
                  {{ datePeriod(exp.startDate, exp.endDate) }} · {{ calculateDate(exp.startDate, exp.endDate) }}
                </div>

                <h3>{{ getTranslatedText(exp.position) }}</h3>

                <div class="org">
                  {{ exp.company }}
                </div>

                <ul>
                  <li
                    v-for="(resp, ri) in exp.responsibilities"
                    :key="ri"
                  >
                    {{ getTranslatedText(resp) }}
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <!-- Education -->
          <Reveal class="block">
            <h2 class="block-title">
              {{ t('resume.education.title') }}
            </h2>

            <div class="tl">
              <div
                v-for="(edu, index) in education"
                :key="index"
                class="tl-item"
              >
                <div class="when">
                  {{ datePeriod(edu.startDate, edu.endDate) }}
                </div>

                <h3>{{ getTranslatedText(edu.level) }}, {{ getTranslatedText(edu.field) }}</h3>

                <div class="org">
                  {{ getTranslatedText(edu.institution) }}
                </div>

                <div class="ed-meta">
                  <span><strong>{{ t('resume.education.field') }}:</strong> {{ getTranslatedText(edu.field) }}</span>

                  <span><strong>{{ t('resume.education.specialization') }}:</strong> {{ getTranslatedText(edu.specialization) }}</span>
                </div>
              </div>
            </div>
          </Reveal>

          <!-- Highlighted Projects -->
          <Reveal class="block">
            <h2 class="block-title">
              {{ t('resume.highlightedProjects.title') }}
            </h2>

            <div class="rproj">
              <article
                v-for="(project, index) in highlightedProjects"
                :key="index"
                class="card"
              >
                <div class="rproj-top">
                  <h3>{{ getTranslatedText(project.name) }}</h3>

                  <span class="badge">
                    <v-icon size="12">mdi-star</v-icon>
                    {{ locale === 'en'
                      ? 'Featured'
                      : 'Wyróżniony' }}
                  </span>
                </div>

                <p>{{ getTranslatedText(project.description) }}</p>

                <div class="rproj-foot">
                  <div />

                  <a
                    class="btn btn-ghost btn-sm"
                    :href="project.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ t('resume.highlightedProjects.view') }}
                    <v-icon size="13">mdi-arrow-top-right</v-icon>
                  </a>
                </div>
              </article>
            </div>
          </Reveal>
        </div>

        <!-- SIDEBAR -->
        <aside class="side">
          <Reveal class="card r-side-card">
            <h2 class="side-title">
              {{ t('resume.skills.title') }}
            </h2>

            <div
              v-for="skillCategory in skills"
              :key="getTranslatedText(skillCategory.title)"
              class="skillgrp"
            >
              <div class="skillgrp-lbl">
                {{ getTranslatedText(skillCategory.title) }}
              </div>

              <div class="tags">
                <span
                  v-for="(skill, si) in skillCategory.skills"
                  :key="skill.name"
                  class="tag"
                  :class="[
                    si === 0
                      ? 'tag-accent'
                      : '',
                  ]"
                >{{ skill.name }}</span>
              </div>
            </div>
          </Reveal>

          <Reveal
            :delay="1"
            class="card r-side-card"
          >
            <h2 class="side-title">
              {{ t('resume.interests.title') }}
            </h2>

            <div class="r-interests">
              <div
                v-for="interest in interests"
                :key="getTranslatedText(interest.name)"
                class="r-interest"
              >
                <span class="r-ico">
                  <v-icon size="16">{{ interest.icon }}</v-icon>
                </span>
                {{ getTranslatedText(interest.name) }}
              </div>
            </div>
          </Reveal>

          <Reveal
            :delay="2"
            class="card r-side-card"
          >
            <h2 class="side-title">
              {{ t('resume.links.title') }}
            </h2>

            <div class="r-links-list">
              <a
                v-for="link in links"
                :key="getTranslatedText(link.name)"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ getTranslatedText(link.name) }}
                <v-icon size="14">mdi-arrow-top-right</v-icon>
              </a>
            </div>
          </Reveal>
        </aside>
      </div>

      <p class="reveal r-gdpr">
        {{ getTranslatedText(resume.footerText) }}
      </p>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────── */
.resume-hero {
  padding-top: clamp(40px, 6vw, 64px);
  padding-bottom: clamp(28px, 4vw, 40px);
}

.rh-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
}

.rh-name {
  font-size: clamp(38px, 6vw, 64px);
  letter-spacing: -0.035em;
  margin-top: 14px;
}

.rh-role {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: clamp(14px, 2vw, 16px);
  margin-top: 8px;
  letter-spacing: 0.02em;
}

.dl-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.cchip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-muted);
  padding: 8px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--bg-1);
}

.cchip a {
  transition: color 0.2s;
}

.cchip a:hover {
  color: var(--accent);
}

/* ── Grid ──────────────────────────────────── */
.resume-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: clamp(28px, 5vw, 56px);
  align-items: start;
}

/* ── Blocks ────────────────────────────────── */
.block {
  margin-bottom: 44px;
}

.block-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 24px;
}

.block-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line-soft);
}

/* ── Summary ───────────────────────────────── */
.r-summary {
  font-size: 17px;
  color: var(--text-muted);
  line-height: 1.72;
}

/* ── Timeline ──────────────────────────────── */
.tl {
  position: relative;
  padding-left: 28px;
}

.tl::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: var(--line);
}

.tl-item {
  position: relative;
  padding-bottom: 30px;
}

.tl-item:last-child {
  padding-bottom: 0;
}

.tl-item::before {
  content: '';
  position: absolute;
  left: -27px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--bg), 0 0 14px var(--glow);
}

.tl-item .when {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.04em;
}

.tl-item h3 {
  font-size: 20px;
  margin: 6px 0 3px;
  letter-spacing: -0.015em;
}

.tl-item .org {
  color: var(--accent);
  font-weight: 600;
  font-size: 14.5px;
}

.tl-item .org .dur {
  color: var(--text-faint);
  font-weight: 400;
  font-family: var(--font-mono);
  font-size: 12px;
  margin-left: 8px;
}

.tl-item ul {
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
  display: grid;
  gap: 9px;
}

.tl-item li {
  position: relative;
  padding-left: 22px;
  font-size: 14.5px;
  color: var(--text-muted);
  line-height: 1.55;
}

.tl-item li::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 2px;
  background: var(--accent-line);
}

.ed-meta {
  display: grid;
  gap: 4px;
  margin-top: 12px;
}

.ed-meta span {
  font-size: 14px;
  color: var(--text-muted);
}

.ed-meta strong {
  color: var(--text);
  font-weight: 600;
}

/* ── Highlighted projects ──────────────────── */
.rproj {
  display: grid;
  gap: 16px;
}

.rproj .card {
  padding: 22px;
}

.rproj-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.rproj-top h3 {
  font-size: 19px;
}

.rproj .card p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 14px;
}

.rproj-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

/* ── Sidebar ───────────────────────────────── */
.side {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.r-side-card {
  padding: 22px;
  margin-bottom: 16px;
}

.side-title {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}

.skillgrp {
  margin-bottom: 16px;
}

.skillgrp:last-child {
  margin-bottom: 0;
}

.skillgrp-lbl {
  font-size: 12px;
  color: var(--text-faint);
  font-family: var(--font-mono);
  margin-bottom: 8px;
}

.r-interests {
  display: grid;
  gap: 12px;
}

.r-interest {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14.5px;
  color: var(--text);
}

.r-ico {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: var(--accent);
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
  flex-shrink: 0;
}

.r-links-list {
  display: grid;
  gap: 8px;
}

.r-links-list a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  color: var(--text);
}

.r-links-list a:hover {
  border-color: var(--accent-line);
  background: var(--accent-soft);
  color: var(--accent);
}

/* ── GDPR ──────────────────────────────────── */
.r-gdpr {
  margin-top: 8px;
  font-size: 11.5px;
  color: var(--text-faint);
  line-height: 1.5;
  max-width: 70ch;
}

/* ── Responsive ────────────────────────────── */
@media (max-width: 900px) {
  .resume-grid {
    grid-template-columns: 1fr;
  }

  .rh-top {
    align-items: flex-start;
  }
}

/* ── Print ─────────────────────────────────── */
@media print {
  :deep(.nav),
  :deep(.footer) {
    display: none !important;
  }

  .resume-hero,
  .resume-grid,
  .r-gdpr {
    color: #111;
  }

  .rh-role,
  .block-title,
  .tl-item .org,
  .side-title {
    color: #555;
  }

  .tl::before,
  .tl-item::before {
    background: #888;
    box-shadow: none;
  }

  .dl-actions {
    display: none;
  }

  .cchip {
    border-color: #ccc;
    background: transparent;
  }

  .card {
    border: 1px solid #ddd;
    background: transparent;
    box-shadow: none;
  }
}
</style>
