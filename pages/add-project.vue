<script lang="ts" setup>
import { GitHubService } from '~/composables/useGithub'

const correctPassword = 'password123'
const password = ref('')
const repositoryUrl = ref('')

function addProject() {
  const github = new GitHubService()
  github.getFileContent('JakubTutka', 'LeagueRats', 'https://github.com/JakubTuta/LeagueRats/blob/main/README.md')
}
</script>

<template>
  <v-container>
    <v-card v-if="password !== correctPassword">
      <v-card-text>
        <v-text-field
          v-model="password"
          label="Enter the password to add a project"
          type="password"
        />
      </v-card-text>
    </v-card>

    <v-card v-else>
      <v-card-text>
        <v-text-field
          v-model="repositoryUrl"
          label="GitHub Repository URL"
          @keydown:enter="addProject"
        />

        <v-btn
          color="primary"
          @click="addProject"
        >
          Add Project
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
