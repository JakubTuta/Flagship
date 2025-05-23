<script setup lang="ts">
const { t } = useI18n()

const navigationCards = computed(() => [
  {
    title: t('navigation.projects.title'),
    description: t('navigation.projects.description'),
    icon: 'mdi-code-braces',
    color: 'primary',
    route: '/projects',
  },
  {
    title: t('navigation.blog.title'),
    description: t('navigation.blog.description'),
    icon: 'mdi-post',
    color: 'secondary',
    route: '/blog',
  },
  {
    title: t('navigation.resume.title'),
    description: t('navigation.resume.description'),
    icon: 'mdi-file-document',
    color: 'accent',
    route: '/resume',
  },
])

const skills = computed(() => [
  {
    name: 'Vue.js',
    icon: 'mdi-vuejs',
    color: 'success',
    additional: [
      'Nuxt',
    ],
  },
  {
    name: 'TypeScript',
    icon: 'mdi-language-typescript',
    color: 'info',
  },
  {
    name: 'Python',
    icon: 'mdi-language-python',
    color: 'success',
    additional: [
      'Django',
      'FastAPI',
      'Flask',
    ],
  },
  {
    name: 'Docker',
    icon: 'mdi-docker',
    color: 'info',
  },
  {
    name: t('skills.database'),
    icon: 'mdi-database',
    color: 'accent',
    additional: [
      'PostgreSQL',
      'MongoDB',
      'Firestore',
    ],
  },
  {
    name: 'Git',
    icon: 'mdi-git',
    color: 'error',
    additional: [
      'GitHub',
      'GitLab',
    ],
  },
  {
    name: 'Google Cloud Platform',
    icon: 'mdi-google-cloud',
    color: 'info',
    additional: [
      'Cloud Functions',
      'Cloud Run',
      'Container Registry',
      'Cloud Storage',
      'Firebase',
    ],
  },

  {
    name: t('skills.others'),
    icon: 'mdi-plus',
    color: 'primary',
    additional: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'Vuetify',
      'Figma',
    ],
  },
])

const contactMethods = computed(() => [
  {
    title: 'Email',
    info: 'jakubtutka02@gmail.com',
    icon: 'mdi-email',
    color: 'primary',
    action: t('contact.email.action'),
    email: 'jakubtutka02@gmail.com',
  },
  {
    title: 'LinkedIn',
    info: t('contact.linkedin.info'),
    icon: 'mdi-linkedin',
    color: 'info',
    action: t('contact.linkedin.action'),
    to: 'https://www.linkedin.com/in/jakub-tutka-077b55352/',
  },
  {
    title: 'GitHub',
    info: t('contact.github.info'),
    icon: 'mdi-github',
    color: 'secondary',
    action: t('contact.github.action'),
    to: 'https://github.com/JakubTuta',
  },
])

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <div class="hero-section align-center flex justify-center pa-0">
      <v-row
        no-gutters
        class="fill-height"
      >
        <v-col
          cols="12"
          class="d-flex align-center justify-center"
        >
          <div class="hero-content text-center">
            <v-avatar
              size="150"
              class="hero-avatar mb-6"
            >
              <v-img
                src="~/assets/profile.jpg"
                alt="Profile Picture"
              />
            </v-avatar>

            <h1 class="hero-title mb-4">
              Jakub Tutka
            </h1>

            <p class="hero-subtitle mb-8">
              {{ $t('landingPage.hero.info') }}
            </p>

            <div class="hero-buttons">
              <v-btn
                size="large"
                color="primary"
                variant="elevated"
                class="mb-2 mr-4"
                @click="scrollToSection('about')"
              >
                <v-icon
                  size="x-large"
                  class="mr-4"
                >
                  mdi-account
                </v-icon>
                {{ $t('landingPage.hero.about') }}
              </v-btn>

              <v-btn
                size="large"
                variant="elevated"
                color="secondary"
                class="mb-2"
                @click="scrollToSection('contact')"
              >
                <v-icon
                  size="x-large"
                  class="mr-4"
                >
                  mdi-email
                </v-icon>
                {{ $t('landingPage.hero.contact') }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <div class="scroll-indicator">
        <v-icon
          class="bounce-animation"
          size="x-large"
          @click="scrollToSection('about')"
        >
          mdi-chevron-down
        </v-icon>
      </div>
    </div>

    <!-- Navigation Cards Section -->
    <v-container
      id="about"
      class="py-16"
    >
      <v-row class="mb-12 justify-center">
        <v-col
          cols="12"
          md="8"
          class="text-center"
        >
          <h2 class="section-title mb-4">
            {{ $t('landingPage.about.title') }}
          </h2>

          <p class="section-subtitle">
            {{ $t('landingPage.about.subtitle') }}
          </p>
        </v-col>
      </v-row>

      <v-row class="justify-center">
        <v-col
          v-for="(card, index) in navigationCards"
          :key="index"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card
            class="nav-card h-100 pa-6 text-center"
            elevation="4"
            hover
            :to="card.route"
          >
            <div class="nav-icon mb-4">
              <v-icon
                :color="card.color"
                size="48"
              >
                {{ card.icon }}
              </v-icon>
            </div>

            <v-card-title class="mb-2 justify-center">
              {{ card.title }}
            </v-card-title>

            <v-card-text>{{ card.description }}</v-card-text>

            <v-card-actions class="justify-center">
              <v-btn
                :color="card.color"
                variant="text"
              >
                {{ $t('landingPage.about.learnMore') }}
                <v-icon right>
                  mdi-arrow-right
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-spacer
      class="my-30"
    />

    <!-- Skills Section -->
    <v-container
      fluid
      class="skills-section py-16"
    >
      <v-container>
        <v-row class="mb-12 justify-center">
          <v-col
            cols="12"
            md="8"
            class="text-center"
          >
            <h2 class="section-title mb-4">
              {{ $t('landingPage.skills.title') }}
            </h2>

            <p class="section-subtitle">
              {{ $t('landingPage.skills.subtitle') }}
            </p>
          </v-col>
        </v-row>

        <v-row class="justify-center">
          <v-col
            cols="12"
            md="8"
          >
            <v-row>
              <v-col
                v-for="(skill, index) in skills"
                :key="index"
                cols="6"
                sm="4"
                md="3"
                class="mb-4 text-center"
              >
                <v-card
                  class="skill-card pa-4"
                  elevation="2"
                  hover
                  min-height="110"
                  style="display: flex; flex-direction: column; justify-content: center; align-items: center;"
                >
                  <v-icon
                    :color="skill.color"
                    size="35"
                    class="mb-2"
                  >
                    {{ skill.icon }}
                  </v-icon>

                  <div class="skill-name">
                    {{ skill.name }}
                  </div>

                  <v-tooltip
                    v-if="skill.additional"
                    location="bottom"
                    activator="parent"
                  >
                    <v-list
                      rounded="xl"
                      min-width="150"
                    >
                      <v-list-item
                        v-for="item in skill.additional"
                        :key="item"
                      >
                        {{ item }}
                      </v-list-item>
                    </v-list>
                  </v-tooltip>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-spacer
      class="my-30"
    />

    <!-- Contact Section -->
    <v-container
      id="contact"
      class="py-16"
    >
      <v-row class="justify-center">
        <v-col
          cols="12"
          md="8"
          class="text-center"
        >
          <h2 class="section-title mb-4">
            {{ $t('landingPage.contact.title') }}
          </h2>

          <p class="section-subtitle mb-8">
            {{ $t('landingPage.contact.subtitle') }}
          </p>

          <v-row class="justify-center">
            <v-col
              v-for="(contact, index) in contactMethods"
              :key="index"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                class="contact-card pa-6"
                elevation="3"
                hover
              >
                <v-icon
                  :color="contact.color"
                  size="32"
                  class="mb-3"
                >
                  {{ contact.icon }}
                </v-icon>

                <h3 class="mb-2">
                  {{ contact.title }}
                </h3>

                <p class="contact-info">
                  {{ contact.info }}
                </p>

                <v-btn
                  v-if="contact.to"
                  :href="contact.to"
                  target="_blank"
                  rel="noopener noreferrer"
                  :color="contact.color"
                  variant="outlined"
                  class="mt-3"
                >
                  {{ contact.action }}
                </v-btn>

                <v-btn
                  v-if="contact.email"
                  :href="`mailto:${contact.email}`"
                  :color="contact.color"
                  variant="outlined"
                  class="mt-3"
                >
                  {{ contact.action }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-spacer
      class="my-30"
    />
  </div>
</template>

<style scoped>
.landing-page {
  overflow-x: hidden;
}

.hero-section {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: rgb(var(--v-theme-on-primary));
  position: relative;
}

.hero-content {
  z-index: 2;
}

.hero-avatar {
  border: 4px solid rgba(var(--v-theme-on-primary), 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.hero-title {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  font-weight: 300;
}

.hero-buttons .v-btn {
  min-width: 150px;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(var(--v-theme-on-primary), 0.7);
}

.bounce-animation {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.section-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: rgb(var(--v-theme-on-background));
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 600px;
  margin: 0 auto;
}

.nav-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 16px !important;
}

.nav-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.nav-icon {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skills-section {
  background: rgb(var(--v-theme-surface-variant));
}

.skill-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.skill-card:hover {
  transform: translateY(-4px);
}

.skill-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.contact-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
}

.contact-card:hover {
  transform: translateY(-4px);
}

.contact-info {
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .hero-buttons .v-btn {
    display: block;
    width: 100%;
    margin: 0.5rem 0;
  }
}
</style>
