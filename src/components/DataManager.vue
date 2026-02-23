<script setup>
/**
 * DataManager — Backup / Import / Clear All data panel.
 * Displayed in a collapsible section or modal overlay.
 */
import { ref } from 'vue'
import { Download, Upload, Trash2, AlertTriangle, X, Database } from 'lucide-vue-next'

import { useI18n } from '../composables/useI18n.js'
import { useDataService } from '../composables/useDataService.js'
import BaseButton from './BaseButton.vue'

const { t } = useI18n()
const { exportData, importData, clearAllData, importError } = useDataService()

const emit = defineEmits(['close', 'imported'])

// ── File input ref ──────────────────────────────
const fileInput = ref(null)

// ── Dialog states ───────────────────────────────
const showConfirmImport = ref(false)
const showConfirmClear = ref(false)
const pendingFile = ref(null)
const feedbackMsg = ref('')
const feedbackType = ref('') // 'success' | 'error'

function clearFeedback() {
  feedbackMsg.value = ''
  feedbackType.value = ''
}

// ── Export ───────────────────────────────────────
function handleExport() {
  clearFeedback()
  const ok = exportData()
  if (!ok) {
    feedbackMsg.value = t('data.noData')
    feedbackType.value = 'error'
  }
}

// ── Import flow ─────────────────────────────────
function triggerFileInput() {
  clearFeedback()
  fileInput.value?.click()
}

function onFileSelected(e) {
  const file = e.target.files?.[0]
  if (!file) return
  pendingFile.value = file
  showConfirmImport.value = true
  // Reset input so the same file can be re-selected
  e.target.value = ''
}

async function confirmImport() {
  showConfirmImport.value = false
  if (!pendingFile.value) return

  const ok = await importData(pendingFile.value)
  pendingFile.value = null

  if (ok) {
    feedbackMsg.value = t('data.importSuccess')
    feedbackType.value = 'success'
    // Reload after brief delay so user sees the message
    setTimeout(() => window.location.reload(), 800)
  } else {
    feedbackMsg.value = t('data.importError')
    feedbackType.value = 'error'
  }
}

function cancelImport() {
  showConfirmImport.value = false
  pendingFile.value = null
}

// ── Clear all ───────────────────────────────────
function requestClear() {
  clearFeedback()
  showConfirmClear.value = true
}

function confirmClear() {
  clearAllData()
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="emit('close')"
      />

      <!-- Panel -->
      <div class="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl mx-4 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 pt-5 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center">
              <Database :size="18" class="text-[var(--color-accent)]" />
            </div>
            <h2 class="text-base font-bold text-[var(--color-text-primary)]">
              {{ t('data.title') }}
            </h2>
          </div>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            @click="emit('close')"
          >
            <X :size="18" class="text-[var(--color-text-muted)]" />
          </button>
        </div>

        <!-- Content -->
        <div class="px-5 pb-5 flex flex-col gap-3">
          <!-- Feedback toast -->
          <div
            v-if="feedbackMsg"
            :class="[
              'rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2',
              feedbackType === 'success' && 'bg-emerald-50 text-emerald-700 border border-emerald-200',
              feedbackType === 'error' && 'bg-red-50 text-red-600 border border-red-200',
            ]"
          >
            <AlertTriangle v-if="feedbackType === 'error'" :size="16" />
            {{ feedbackMsg }}
          </div>

          <!-- Backup button -->
          <BaseButton variant="default" size="md" class="w-full" @click="handleExport">
            <Download :size="16" />
            {{ t('data.backup') }}
          </BaseButton>

          <!-- Import button + hidden file input -->
          <BaseButton variant="default" size="md" class="w-full" @click="triggerFileInput">
            <Upload :size="16" />
            {{ t('data.import') }}
          </BaseButton>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="onFileSelected"
          />

          <!-- Separator -->
          <div class="border-t border-[var(--color-border)] my-1" />

          <!-- Danger zone: Clear All -->
          <BaseButton variant="danger" size="md" class="w-full" @click="requestClear">
            <Trash2 :size="16" />
            {{ t('data.clearAll') }}
          </BaseButton>
        </div>
      </div>

      <!-- ═══ Confirm Import Dialog ═══ -->
      <div
        v-if="showConfirmImport"
        class="fixed inset-0 z-[60] flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/30 backdrop-blur-sm"
          @click="cancelImport"
        />
        <div class="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 mx-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle :size="20" class="text-amber-600" />
            </div>
            <div>
              <h3 class="font-bold text-[var(--color-text-primary)]">
                {{ t('data.confirmImport') }}
              </h3>
              <p class="text-sm text-[var(--color-text-muted)] mt-0.5">
                {{ t('data.confirmImportMsg') }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <BaseButton variant="default" size="md" class="flex-1" @click="cancelImport">
              {{ t('data.cancel') }}
            </BaseButton>
            <BaseButton variant="accent" size="md" class="flex-1" @click="confirmImport">
              {{ t('data.confirmImportBtn') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- ═══ Confirm Clear Dialog ═══ -->
      <div
        v-if="showConfirmClear"
        class="fixed inset-0 z-[60] flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/30 backdrop-blur-sm"
          @click="showConfirmClear = false"
        />
        <div class="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 mx-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle :size="20" class="text-red-500" />
            </div>
            <div>
              <h3 class="font-bold text-[var(--color-text-primary)]">
                {{ t('data.confirmClear') }}
              </h3>
              <p class="text-sm text-[var(--color-text-muted)] mt-0.5">
                {{ t('data.confirmClearMsg') }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <BaseButton variant="default" size="md" class="flex-1" @click="showConfirmClear = false">
              {{ t('data.cancel') }}
            </BaseButton>
            <BaseButton variant="danger" size="md" class="flex-1" @click="confirmClear">
              {{ t('data.confirmClearBtn') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
