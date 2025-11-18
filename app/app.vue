<script setup lang="ts">
interface HaikuResponse {
  success: boolean;
  haiku: string;
  topic: string;
}

const topic = ref("");
const generatedHaiku = ref("");
const isLoading = ref(false);
const error = ref("");
const returnedTopic = ref("");

const generateHaiku = async () => {
  if (!topic.value.trim()) {
    error.value = "Please enter a topic";
    return;
  }

  isLoading.value = true;
  error.value = "";
  generatedHaiku.value = "";

  try {
    const response = await $fetch<HaikuResponse>("/api/generate-haiku", {
      method: "POST",
      body: { topic: topic.value },
    });

    generatedHaiku.value = response.haiku;
    returnedTopic.value = response.topic;
    topic.value = "";
  } catch (err: any) {
    error.value =
      err.data?.message || "Failed to generate haiku. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    style="
      padding: 2rem;
      font-family: sans-serif;
      max-width: 600px;
      margin: 0 auto;
    "
  >
    <h1 style="text-align: center; color: #333">AI Haiku Generator</h1>
    <p style="text-align: center; color: #666; margin-bottom: 2rem">
      Enter a topic and let AI create a beautiful haiku for you
    </p>

    <form @submit.prevent="generateHaiku" style="margin-bottom: 2rem">
      <div style="margin-bottom: 1rem">
        <label
          for="topic"
          style="
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
            color: #333;
          "
        >
          Topic:
        </label>
        <textarea
          id="topic"
          v-model="topic"
          placeholder="Enter a topic (e.g., autumn leaves, ocean waves, moonlight...)"
          rows="3"
          style="
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            font-family: sans-serif;
            resize: vertical;
          "
          :disabled="isLoading"
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading || !topic.trim()"
        style="
          width: 100%;
          padding: 0.75rem;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        "
        :style="{
          opacity: isLoading || !topic.trim() ? 0.6 : 1,
          cursor: isLoading || !topic.trim() ? 'not-allowed' : 'pointer',
        }"
      >
        {{ isLoading ? "Generating..." : "Generate Haiku" }}
      </button>
    </form>

    <div
      v-if="isLoading"
      style="text-align: center; padding: 2rem; color: #666"
    >
      <div style="font-size: 2rem; margin-bottom: 0.5rem">🤔</div>
      <p>AI is crafting your haiku about {{ returnedTopic }}...</p>
    </div>

    <div
      v-if="error"
      style="
        padding: 1rem;
        background-color: #ffebee;
        border-left: 4px solid #f44336;
        border-radius: 4px;
        color: #c62828;
      "
    >
      {{ error }}
    </div>

    <div v-if="generatedHaiku && !isLoading" style="margin-top: 2rem">
      <h2 style="color: #333; margin-bottom: 1rem">
        Your Haiku about {{ returnedTopic }}:
      </h2>
      <div
        style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          border-radius: 12px;
          color: white;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        "
      >
        <div
          style="
            font-size: 1.25rem;
            line-height: 1.8;
            white-space: pre-line;
            font-style: italic;
          "
        >
          {{ generatedHaiku }}
        </div>
      </div>
    </div>
  </div>
</template>
