<script setup lang="ts">
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)

const email = ref('')
const password = ref('')
const isShowPassword = ref(false)

function login() {
  authStore.login(email.value, password.value)
}
</script>

<template>
  <div style="display: flex; align-items: center; justify-content: center; height: 100%">
    <v-card max-width="600px">
      <v-card-title class="text-h5">
        Login
      </v-card-title>

      <v-divider class="my-2" />

      <v-card-text>
        <v-text-field
          v-model="email"
          label="Email"
          variant="outlined"
          @keydown.enter="login"
        />

        <v-text-field
          v-model="password"
          class="mt-4"
          label="Password"
          variant="outlined"
          :type="isShowPassword
            ? 'text'
            : 'password'"
          :append-inner-icon="isShowPassword
            ? 'mdi-eye'
            : 'mdi-eye-off'"
          @click:append-inner="isShowPassword = !isShowPassword"
          @keydown.enter="login"
        />

        <v-btn
          class="mt-4"
          block
          size="large"
          color="primary"
          :loading="loading"
          @click="login"
        >
          Login
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
